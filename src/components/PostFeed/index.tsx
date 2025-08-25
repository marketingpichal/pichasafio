import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../PostCard';
import CommentsModal from '../CommentsModal';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthProvider';

interface Post {
  id: string;
  user_id: string;
  content_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface PostFeedProps {
  userId?: string; // Para mostrar posts de un usuario específico
  className?: string;
  refreshTrigger?: number; // Para forzar refresh desde componente padre
}

export default function PostFeed({ userId, className = '', refreshTrigger }: PostFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPostOwner, setSelectedPostOwner] = useState<string>('');
  const [page, setPage] = useState(0);
  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    loadPosts(true);
  }, [userId, refreshTrigger]);

  const loadPosts = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 0 : page;
      const from = currentPage * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      // Si se especifica un userId, filtrar por ese usuario
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (reset) {
        setPosts(data || []);
        setPage(1);
      } else {
        setPosts(prev => [...prev, ...(data || [])]);
        setPage(prev => prev + 1);
      }

      // Verificar si hay más posts
      setHasMore((data || []).length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentClick = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPostId(postId);
      setSelectedPostOwner(post.user_id);
    }
  }, [posts]);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      loadPosts();
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && posts.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-center space-x-3 p-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            
            {/* Actions Skeleton */}
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {userId ? 'No hay posts aún' : 'No hay posts en el feed'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {userId 
              ? 'Este usuario no ha publicado nada todavía.'
              : 'Sé el primero en compartir algo increíble.'
            }
          </p>
          {!userId && user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Crear tu primer post
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard 
              post={post} 
              onCommentClick={handleCommentClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading More */}
      {loading && posts.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            ¡Has visto todos los posts! 🎉
          </p>
        </motion.div>
      )}

      {/* Comments Modal */}
      <CommentsModal
        isOpen={!!selectedPostId}
        onClose={() => {
          setSelectedPostId(null);
          setSelectedPostOwner('');
        }}
        postId={selectedPostId || ''}
        postOwnerUsername={selectedPostOwner}
      />
    </div>
  );
}