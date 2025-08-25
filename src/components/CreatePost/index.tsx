import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image, Video, Smile, MapPin, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function CreatePost({ isOpen, onClose, onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const uploadFile = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${user?.id}/${Date.now()}.${fileExt}`; // carpeta = userId
  const filePath = fileName; // no le metas "posts/" porque ya estás en el bucket "posts"

  const { error: uploadError } = await supabase.storage
    .from('posts')
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw uploadError;

  // genera la URL pública
  const { data } = supabase.storage.from('posts').getPublicUrl(filePath);

  return { filePath, publicUrl: data.publicUrl };
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }

    if (!selectedFile || uploading) return;

    setUploading(true);

    try {
      const contentUrl = await uploadFile(selectedFile);

      const postData = {
        user_id: user.id,
        content_url: contentUrl.publicUrl,
        caption: caption.trim() || null
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select();

      if (error) {
        throw error;
      }

      // Reset form
      setCaption('');
      setSelectedFile(null);
      setPreviewUrl(null);
      onPostCreated?.();
      onClose();
    } catch (error: any) {
      
      let errorMessage = 'Error al crear el post';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code) {
        errorMessage += ` (Código: ${error.code})`;
      }
      
      if (error.details) {
        errorMessage += ` - ${error.details}`;
      }
      
      alert(errorMessage + '. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setCaption('');
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Crear nuevo post
            </h2>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* File Upload Area */}
            {!selectedFile ? (
              <div
                className={`flex-1 m-4 border-2 border-dashed rounded-xl transition-all ${
                  dragOver
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Arrastra tu foto o video aquí
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    O haz clic para seleccionar archivos
                  </p>
                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      <span>Foto</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </motion.button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              /* Preview */
              <div className="flex-1 p-4">
                <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {selectedFile.type.startsWith('image/') ? (
                    <img
                      src={previewUrl!}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={previewUrl!}
                      className="w-full h-64 object-cover"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Caption Input */}
                <div className="mt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      {user?.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="Tu avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xs">
                          {(user?.user_metadata?.username || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Escribe una descripción..."
                        className="w-full bg-transparent border-0 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                        rows={3}
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Smile className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <MapPin className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Tag className="w-5 h-5" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">
                          {caption.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            {selectedFile && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  className={`w-full py-3 rounded-full font-medium transition-all ${
                    uploading
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {uploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                      <span>Publicando...</span>
                    </div>
                  ) : (
                    'Compartir'
                  )}
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}