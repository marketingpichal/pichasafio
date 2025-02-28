export default function Donate() {
  return (
    <section className="py-12 px-8 text-center">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
        Apoya el Proyecto
      </h2>
      <p className="text-lg text-gray-200 mb-6">
        Dona a Nequi para el hosting, dominio y mejorar la app.
      </p>
      <a
        href="https://nequi.com.co/" // Cambia por un link de pago si tienes
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
      >
        Donar Ahora
      </a>
    </section>
  );
}
