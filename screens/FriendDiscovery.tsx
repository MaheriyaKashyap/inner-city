
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Users, Calendar, MapPin, Check, Loader2 } from 'lucide-react';
import { 
  findUsersWithMutualInterests, 
  findUsersGoingToSameEvents, 
  findFriendsOfFriends,
  followUser,
  isFollowing 
} from '../services/social';
import { User } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

type DiscoveryType = 'interests' | 'events' | 'friends';

export const FriendDiscovery: React.FC = () => {
  const { theme, user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DiscoveryType>('interests');
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState<Map<string, boolean>>(new Map());
  const isLight = theme.background === '#FFFFFF';

  useEffect(() => {
    if (user) {
      loadSuggestions();
    }
  }, [user, activeTab]);

  const loadSuggestions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let users: User[] = [];
      switch (activeTab) {
        case 'interests':
          users = await findUsersWithMutualInterests(user.id, 20);
          break;
        case 'events':
          users = await findUsersGoingToSameEvents(user.id, 20);
          break;
        case 'friends':
          users = await findFriendsOfFriends(user.id, 20);
          break;
      }
      setSuggestedUsers(users);
      
      // Check follow status for all users
      const followChecks = await Promise.all(
        users.map(async (u) => {
          const following = await isFollowing(user.id, u.id);
          return [u.id, following] as [string, boolean];
        })
      );
      setFollowingStates(new Map(followChecks));
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    if (!user) return;
    try {
      const currentlyFollowing = followingStates.get(targetUserId) || false;
      if (currentlyFollowing) {
        // Unfollow logic would go here if needed
        return;
      }
      await followUser(user.id, targetUserId);
      setFollowingStates(new Map(followingStates.set(targetUserId, true)));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="px-6 py-10">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Discover Friends</h1>
        <p className="text-sm opacity-60 uppercase tracking-widest mb-8">Find people like you</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'interests' as DiscoveryType, label: 'Mutual Interests', icon: Users },
            { id: 'events' as DiscoveryType, label: 'Same Events', icon: Calendar },
            { id: 'friends' as DiscoveryType, label: 'Friends of Friends', icon: UserPlus },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-40'
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? theme.accent : theme.surfaceAlt,
                color: activeTab === tab.id ? (isLight ? '#FFF' : '#000') : theme.text,
              }}
            >
              <div className="flex items-center gap-2">
                <tab.icon size={14} />
                {tab.label}
              </div>
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin opacity-40" />
          </div>
        )}

        {/* Suggestions */}
        {!isLoading && suggestedUsers.length === 0 && (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm opacity-40 uppercase tracking-widest">
              No suggestions found
            </p>
          </div>
        )}

        {!isLoading && suggestedUsers.length > 0 && (
          <div className="space-y-4">
            {suggestedUsers.map((suggestedUser) => {
              const isFollowingUser = followingStates.get(suggestedUser.id) || false;
              return (
                <motion.div
                  key={suggestedUser.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl p-6"
                  style={{ backgroundColor: theme.surface }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {suggestedUser.profilePhotos && suggestedUser.profilePhotos.length > 0 ? (
                        <img
                          src={getOptimizedImageUrl(suggestedUser.profilePhotos[0], 'thumbnail')}
                          alt={suggestedUser.displayName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent + '20' }}>
                          <Users size={24} style={{ color: theme.accent }} />
                        </div>
                      )}
                      {suggestedUser.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <Check size={12} className="text-black" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-lg font-black italic tracking-tighter uppercase mb-1 cursor-pointer hover:opacity-60"
                            onClick={() => navigate(`/profile/${suggestedUser.id}`)}
                          >
                            {suggestedUser.displayName}
                          </h3>
                          <p className="text-xs opacity-60 mb-2">@{suggestedUser.username}</p>
                        </div>
                        <button
                          onClick={() => handleFollow(suggestedUser.id)}
                          disabled={isFollowingUser}
                          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                            isFollowingUser ? 'opacity-50' : ''
                          }`}
                          style={{
                            backgroundColor: isFollowingUser ? theme.surfaceAlt : theme.accent,
                            color: isFollowingUser ? theme.text : (isLight ? '#FFF' : '#000'),
                          }}
                        >
                          {isFollowingUser ? 'Following' : 'Follow'}
                        </button>
                      </div>

                      {suggestedUser.bio && (
                        <p className="text-xs opacity-70 mb-3 line-clamp-2">{suggestedUser.bio}</p>
                      )}

                      {/* Interests */}
                      {suggestedUser.interests && suggestedUser.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {suggestedUser.interests.slice(0, 5).map((interest) => (
                            <span
                              key={interest}
                              className="px-2 py-1 rounded-full text-[9px] uppercase tracking-widest"
                              style={{ backgroundColor: theme.surfaceAlt }}
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Location */}
                      {suggestedUser.homeCity && (
                        <div className="flex items-center gap-1 text-[10px] opacity-40 uppercase tracking-widest">
                          <MapPin size={12} />
                          {suggestedUser.homeCity}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
