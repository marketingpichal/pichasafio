export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-6 px-8 shadow-xl">
      <div className="container mx-auto flex flex-col items-center text-center gap-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          pichasafio.com
        </h1>
        <h4 className="text-lg md:text-xl font-medium text-gray-200 max-w-2xl">
          Agranda tu chimbo, dura más y no te vengas rápido
        </h4>
        <h5 className="text-sm md:text-base font-light text-gray-400 max-w-lg">
          Apoya el proyecto comunitario con donaciones a Nequi para pagar el hosting, dominio y la cerveza de los desarrolladores.
        </h5>
      </div>
    </header>
  );
}