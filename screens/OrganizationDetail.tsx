
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { NeonButton } from '../components/UI';
import { 
  ChevronLeft, Users, Calendar, MapPin, Instagram, Twitter, Globe, 
  Check, Share2, UserPlus, UserMinus, Plus, Loader2 
} from 'lucide-react';
import { 
  getOrganization, 
  getOrganizationMembers, 
  followOrganization, 
  unfollowOrganization, 
  isFollowingOrganization,
  getOrganizationsByCity 
} from '../services/organizations';
import { Organization, OrganizationMember, Event } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimization';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const OrganizationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme, user, events } = useApp();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const isLight = theme.background === '#FFFFFF';

  useEffect(() => {
    if (slug) {
      loadOrganization();
    }
  }, [slug]);

  useEffect(() => {
    if (organization && user) {
      checkFollowingStatus();
      loadMembers();
    }
  }, [organization, user]);

  const loadOrganization = async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const org = await getOrganization(slug);
      setOrganization(org);
    } catch (error) {
      console.error('Error loading organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = async () => {
    if (!organization) return;
    try {
      const orgMembers = await getOrganizationMembers(organization.id);
      setMembers(orgMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const checkFollowingStatus = async () => {
    if (!organization || !user) return;
    try {
      const following = await isFollowingOrganization(organization.id, user.id);
      setIsFollowing(following);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!organization || !user) return;
    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowOrganization(organization.id, user.id);
      } else {
        await followOrganization(organization.id, user.id);
      }
      setIsFollowing(!isFollowing);
      // Reload organization to update follower count
      await loadOrganization();
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin opacity-40" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-4">Organization Not Found</h2>
        <NeonButton onClick={() => navigate('/organizations')}>Back to Organizations</NeonButton>
      </div>
    );
  }

  // Filter events for this organization
  const orgEvents = events.filter(e => e.organizationId === organization.id);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="relative h-[50vh]">
        {organization.coverImageUrl ? (
          <img
            src={getOptimizedImageUrl(organization.coverImageUrl, 'hero')}
            alt={organization.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: theme.accent + '20' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[var(--background)]" />
        
        <div className="absolute top-12 left-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute top-12 right-6 flex gap-3">
          <button className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
            <Share2 size={24} />
          </button>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex items-start gap-4 mb-4">
            {organization.logoUrl ? (
              <img
                src={getOptimizedImageUrl(organization.logoUrl, 'thumbnail')}
                alt={organization.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-white/20" style={{ backgroundColor: theme.accent + '40' }}>
                <Users size={32} style={{ color: theme.accent }} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                  {organization.name}
                </h1>
                {organization.verified && (
                  <div className="px-2 py-1 rounded-full bg-white text-black text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Check size={10} />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-[10px] opacity-60 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {organization.eventCount} events
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  {organization.followerCount} followers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-10 space-y-8">
        {/* Description */}
        {organization.description && (
          <div>
            <h3 className="text-xs uppercase font-black tracking-[0.2em] mb-3 opacity-40">About</h3>
            <p className="leading-relaxed opacity-70 font-medium text-sm border-l-2 pl-6" style={{ borderColor: theme.accent }}>
              {organization.description}
            </p>
          </div>
        )}

        {/* Social Links */}
        {(organization.websiteUrl || organization.instagramHandle || organization.twitterHandle) && (
          <div>
            <h3 className="text-xs uppercase font-black tracking-[0.2em] mb-3 opacity-40">Links</h3>
            <div className="flex flex-wrap gap-3">
              {organization.websiteUrl && (
                <a
                  href={organization.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{ borderColor: theme.border }}
                >
                  <Globe size={16} />
                  <span className="text-xs font-bold uppercase">Website</span>
                </a>
              )}
              {organization.instagramHandle && (
                <a
                  href={`https://instagram.com/${organization.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{ borderColor: theme.border }}
                >
                  <Instagram size={16} />
                  <span className="text-xs font-bold uppercase">{organization.instagramHandle}</span>
                </a>
              )}
              {organization.twitterHandle && (
                <a
                  href={`https://twitter.com/${organization.twitterHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{ borderColor: theme.border }}
                >
                  <Twitter size={16} />
                  <span className="text-xs font-bold uppercase">{organization.twitterHandle}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {user && (
          <div className="flex gap-4">
            <NeonButton
              onClick={handleFollow}
              disabled={isLoadingFollow}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isLoadingFollow ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserMinus size={16} />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Follow
                </>
              )}
            </NeonButton>
          </div>
        )}

        {/* Members */}
        {members.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-black tracking-[0.2em] mb-4 opacity-40">
              Members ({members.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-2 px-3 py-2 rounded-full"
                  style={{ backgroundColor: theme.surfaceAlt }}
                >
                  {member.user?.avatarUrl && (
                    <img
                      src={getOptimizedImageUrl(member.user.avatarUrl, 'thumbnail')}
                      alt={member.user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <div className="text-xs font-bold">{member.user?.displayName || 'Anonymous'}</div>
                    <div className="text-[9px] opacity-60 uppercase">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        <div>
          <h3 className="text-xs uppercase font-black tracking-[0.2em] mb-4 opacity-40">
            Events ({orgEvents.length})
          </h3>
          {orgEvents.length === 0 ? (
            <div className="text-center py-10 opacity-40">
              <Calendar size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs uppercase tracking-widest">No events yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orgEvents.map((event) => (
                <OrganizationEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrganizationEventCard: React.FC<{ event: Event }> = ({ event }) => {
  const { theme } = useApp();
  const navigate = useNavigate();
  const isLight = theme.background === '#FFFFFF';
  const startDate = new Date(event.startAt);
  const isLive = new Date() >= startDate && new Date() <= new Date(event.endAt);

  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      className="rounded-3xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      style={{ backgroundColor: theme.surface }}
    >
      {event.mediaUrls && event.mediaUrls.length > 0 && (
        <div className="aspect-[16/9] w-full relative">
          <img
            src={getOptimizedImageUrl(event.mediaUrls[0], 'card')}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {isLive && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse">
              <span className="text-[8px] font-black uppercase tracking-widest text-white">Live</span>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <h4 className="text-lg font-black italic tracking-tighter uppercase mb-2">{event.title}</h4>
        {event.shortDesc && (
          <p className="text-xs opacity-60 line-clamp-2 mb-3">{event.shortDesc}</p>
        )}
        <div className="flex items-center gap-4 text-[10px] opacity-40 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {format(startDate, 'MMM d, h:mm a')}
          </div>
          {event.venueName && (
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              {event.venueName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
