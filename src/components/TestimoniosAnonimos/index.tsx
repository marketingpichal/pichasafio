import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import ResponsiveCard from '../common/ResponsiveCard';
import ResponsiveButton from '../common/ResponsiveButton';
import { MessageCircle, Send, User, Calendar } from 'lucide-react';

interface Testimonial {
  id: number;
  content: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  profiles: {
    username: string;
  } | null;
}

export default function Testimonials() {
  const [comment, setComment] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          profiles!userId (
            username
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  // Add real-time subscription
  useEffect(() => {
    fetchTestimonials();

    const channel = supabase
      .channel('testimonials_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonials'
        },
        () => {
          fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError('Debes iniciar sesión para compartir un testimonio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          content: comment,
          status: 'approved',
          userId: user.id
        });

      if (insertError) throw insertError;

      setComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4">
            Testimonios God
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comparte tu experiencia y lee las historias de otros usuarios
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <ResponsiveCard
            title="Comparte tu Experiencia"
            subtitle="Tu testimonio puede ayudar a otros"
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="testimonial" className="block text-sm font-medium text-gray-300">
                  Tu testimonio
                </label>
                <textarea
                  id="testimonial"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuenta tu experiencia con Pichasafio.com..."
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={4}
                  maxLength={500}
                  disabled={loading}
                />
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Máximo 500 caracteres</span>
                  <span>{comment.length}/500</span>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
                >
                  <p className="text-green-400 text-sm">
                    ¡Gracias por tu testimonio! Ya está publicado.
                  </p>
                </motion.div>
              )}

              <ResponsiveButton
                type="submit"
                disabled={loading || !comment.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Enviar Testimonio</span>
                  </div>
                )}
              </ResponsiveButton>
            </form>
          </ResponsiveCard>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <ResponsiveCard className="h-full">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{testimonial.profiles?.username || 'Anónimo'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(testimonial.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </ResponsiveCard>
            </motion.div>
          ))}
        </motion.div>

        {testimonials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No hay testimonios aún
            </h3>
            <p className="text-gray-500">
              Sé el primero en compartir tu experiencia
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}