// src/components/Testimonials.js
import { useState } from 'react';

export default function Testimonials() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComments([...comments, comment]);
    setComment('');
  };

  return (
    <section className="py-12 px-8 bg-gray-800">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-6">
        Testimonios God
      </h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuenta tu experiencia..."
          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
        >
          Enviar
        </button>
      </form>
      <div className="mt-6">
        {comments.map((c, i) => (
          <p key={i} className="text-gray-200 bg-gray-900 p-3 rounded-lg mt-2">
            Anónimo: {c}
          </p>
        ))}
      </div>
    </section>
  );
}