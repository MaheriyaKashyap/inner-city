
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton, Input } from '../components/UI';
import { Plus, Users, MapPin, Calendar, ChevronRight, X, Instagram, Twitter, Globe, Check } from 'lucide-react';
import { getOrganizationsByCity, createOrganization, followOrganization, unfollowOrganization, isFollowingOrganization } from '../services/organizations';
import { Organization } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

export const Organizations: React.FC = () => {
  const { theme, user, activeCity } = useApp();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isLight = theme.background === '#FFFFFF';

  useEffect(() => {
    if (activeCity) {
      loadOrganizations();
    }
  }, [activeCity]);

  const loadOrganizations = async () => {
    if (!activeCity) return;
    setIsLoading(true);
    try {
      const orgs = await getOrganizationsByCity(activeCity.id);
      setOrganizations(orgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowCreateModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm opacity-40 uppercase tracking-widest">Loading organizations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Organizations</h1>
            <p className="text-sm opacity-60 uppercase tracking-widest">Event Curators & Promoters</p>
          </div>
          {user && (
            <button
              onClick={handleCreateClick}
              className="p-4 rounded-full"
              style={{ backgroundColor: theme.accent }}
            >
              <Plus size={24} color={isLight ? '#FFF' : '#000'} />
            </button>
          )}
        </div>

        {organizations.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm opacity-40 uppercase tracking-widest mb-6">No organizations yet</p>
            {user && (
              <NeonButton onClick={handleCreateClick}>Create Organization</NeonButton>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {organizations.map((org) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                theme={theme}
                isLight={isLight}
                onFollowChange={loadOrganizations}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateOrganizationModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              loadOrganizations();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const OrganizationCard: React.FC<{
  organization: Organization;
  theme: any;
  isLight: boolean;
  onFollowChange: () => void;
}> = ({ organization, theme, isLight, onFollowChange }) => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  useEffect(() => {
    if (user) {
      checkFollowingStatus();
    }
  }, [user, organization.id]);

  const checkFollowingStatus = async () => {
    if (!user) return;
    try {
      const following = await isFollowingOrganization(organization.id, user.id);
      setIsFollowing(following);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowOrganization(organization.id, user.id);
      } else {
        await followOrganization(organization.id, user.id);
      }
      setIsFollowing(!isFollowing);
      onFollowChange();
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/organization/${organization.slug}`)}
      className="rounded-3xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      style={{ backgroundColor: theme.surface }}
    >
      {organization.coverImageUrl && (
        <div className="h-32 w-full relative">
          <img
            src={getOptimizedImageUrl(organization.coverImageUrl, 'card')}
            alt={organization.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {organization.logoUrl ? (
            <img
              src={getOptimizedImageUrl(organization.logoUrl, 'thumbnail')}
              alt={organization.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent + '20' }}>
              <Users size={24} style={{ color: theme.accent }} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black italic tracking-tighter uppercase mb-1 truncate">
                  {organization.name}
                </h3>
                {organization.description && (
                  <p className="text-xs opacity-60 line-clamp-2 mb-2">{organization.description}</p>
                )}
              </div>
              {organization.verified && (
                <div className="px-2 py-1 rounded-full bg-white text-black text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Check size={10} />
                  Verified
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-[10px] opacity-40 uppercase tracking-widest mt-2">
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
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={handleFollow}
              disabled={isLoadingFollow}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                isFollowing ? 'opacity-50' : ''
              }`}
              style={{
                backgroundColor: isFollowing ? theme.surfaceAlt : theme.accent,
                color: isFollowing ? theme.text : (isLight ? '#FFF' : '#000'),
              }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/organization/${organization.slug}`);
            }}
            className="flex-1 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border flex items-center justify-center gap-2"
            style={{ borderColor: theme.border }}
          >
            View <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CreateOrganizationModal: React.FC<{
  onClose: () => void;
  onCreated: () => void;
}> = ({ onClose, onCreated }) => {
  const { theme, user, activeCity } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    coverImageUrl: '',
    websiteUrl: '',
    instagramHandle: '',
    twitterHandle: '',
  });
  const isLight = theme.background === '#FFFFFF';

  const handleSubmit = async () => {
    if (!user || !activeCity) {
      setError('You must be logged in and have a city selected');
      return;
    }
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await createOrganization(
        formData.name.trim(),
        activeCity.id,
        user.id,
        {
          description: formData.description.trim() || undefined,
          logoUrl: formData.logoUrl.trim() || undefined,
          coverImageUrl: formData.coverImageUrl.trim() || undefined,
          websiteUrl: formData.websiteUrl.trim() || undefined,
          instagramHandle: formData.instagramHandle.trim() || undefined,
          twitterHandle: formData.twitterHandle.trim() || undefined,
        }
      );
      onCreated();
    } catch (err: any) {
      console.error('Error creating organization:', err);
      setError(err.message || 'Failed to create organization');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: theme.background }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Create Organization</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:opacity-60">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl text-sm" style={{ backgroundColor: theme.surfaceAlt, color: theme.text }}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
              Organization Name *
            </label>
            <Input
              placeholder="e.g. What's The Move Vancouver"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
              Description
            </label>
            <textarea
              placeholder="Tell us about your organization..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl text-sm resize-none"
              style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
              rows={4}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
              Logo URL
            </label>
            <Input
              placeholder="https://..."
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
              Cover Image URL
            </label>
            <Input
              placeholder="https://..."
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
              Website URL
            </label>
            <Input
              placeholder="https://..."
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
                Instagram
              </label>
              <Input
                placeholder="@username"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
                Twitter
              </label>
              <Input
                placeholder="@username"
                value={formData.twitterHandle}
                onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
              />
            </div>
          </div>

          <NeonButton
            onClick={handleSubmit}
            disabled={isCreating || !formData.name.trim()}
            className="w-full mt-6"
          >
            {isCreating ? 'Creating...' : 'Create Organization'}
          </NeonButton>
        </div>
      </motion.div>
    </motion.div>
  );
};
