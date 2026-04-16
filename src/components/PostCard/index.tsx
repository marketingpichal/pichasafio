import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Pause } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

interface Post {
  id: string;
  user_id: string;
  content_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface PostCardProps {
  post: Post;
  onCommentClick?: (postId: string) => void;
}



export default function PostCard({ post, onCommentClick }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const isVideo = post.content_url.includes('.mp4') || post.content_url.includes('.webm') || post.content_url.includes('.mov');
  const timeAgo = getTimeAgo(post.created_at);
  const truncatedCaption = post.caption && post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption;

  useEffect(() => {
    if (user?.id) {
      checkUserLike();
    }
  }, [user?.id, post.id]);

  const checkUserLike = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single();
      
      setIsLiked(!!data);
    } catch (error) {
      // No like found, which is fine
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Add like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });
        
        if (error) throw error;
        
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleVideoToggle = () => {
    setIsPlaying(!isPlaying);
  };

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}sem`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden mb-6 max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {post.user_id.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {post.user_id.substring(0, 8)}...
            </p>
            <p className="text-gray-500 text-xs">{timeAgo}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="relative">
        {isVideo ? (
          <div className="relative">
            <video
              src={post.content_url}
              className="w-full aspect-square object-cover"
              loop
              muted
              playsInline
              ref={(video) => {
                if (video) {
                  if (isPlaying) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }
              }}
            />
            <button
              onClick={handleVideoToggle}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white bg-opacity-80 rounded-full p-3"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-gray-800" />
                ) : (
                  <Play className="w-6 h-6 text-gray-800 ml-1" />
                )}
              </motion.div>
            </button>
          </div>
        ) : (
          <img
            src={post.content_url}
            alt="Post content"
            className="w-full aspect-square object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            {/* Reaction Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`p-2 rounded-full transition-all ${
                  isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCommentClick?.(post.id)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 transition-colors ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
            {likesCount.toLocaleString()} {likesCount === 1 ? 'me gusta' : 'me gusta'}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="mb-2">
            <p className="text-gray-900 dark:text-white text-sm">
              <span className="font-semibold">{post.user_id.substring(0, 8)}...</span>{' '}
              {showFullCaption ? post.caption : truncatedCaption}
              {post.caption.length > 100 && (
                <button
                  onClick={() => setShowFullCaption(!showFullCaption)}
                  className="text-gray-500 ml-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showFullCaption ? 'ver menos' : 'ver más'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Comments Count */}
        {post.comments_count > 0 && (
          <button
            onClick={() => onCommentClick?.(post.id)}
            className="text-gray-500 text-sm hover:text-gray-700 dark:hover:text-gray-300"
          >
            Ver los {post.comments_count} comentarios
          </button>
        )}
      </div>
    </motion.div>
  );
}