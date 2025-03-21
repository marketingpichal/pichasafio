// src/components/Testimonials.js
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Update interface to include user info
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
          userId: user.id  // Changed to match the column name in your table
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

  // Update the testimonial display section
  return (
    <section className="py-12 px-8 bg-gray-800">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-6">
        Testimonios God
      </h2>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuenta tu experiencia..."
          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 min-h-[100px]"
          maxLength={500}
        />
        
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
        
        {success && (
          <p className="text-green-500 mt-2">
            ¡Gracias por tu testimonio! Ya está publicado.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full ${
            loading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white py-2 px-6 rounded-lg transition-colors`}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-gray-900 p-6 rounded-lg shadow-xl"
          >
            <p className="text-gray-200">{testimonial.content}</p>
            <div className="mt-4 text-gray-400 text-sm">
              {testimonial.user?.username || 'Anónimo'} • {new Date(testimonial.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}