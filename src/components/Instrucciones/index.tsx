export default function Instructions() {
    return (
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-8 shadow-2xl">
        <div className="container mx-auto flex flex-col items-center gap-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Instrucciones del Reto
          </h2>
          <div className="w-full max-w-3xl">
            <iframe
              className="w-full h-64 md:h-96 rounded-xl shadow-lg"
              src="https://www.youtube.com/embed/_uRHmODSNr0?si=rizYN4RS4bZ8_zja"
              title="Instrucciones del Reto - Pichasafio"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-base md:text-lg font-medium text-gray-200 max-w-2xl text-center">
            Ver el video antes de comenzar con el reto para tener bases solidas y no cagarla en el intento.
          </p>
        </div>
      </section>
    );
  }