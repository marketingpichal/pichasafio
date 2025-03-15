export default function PublicMessage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <h2 className="text-2xl font-bold mb-4">Hola, si quieres que te crezca la picha</h2>
        <p className="text-lg text-center mb-4">
          Para ver todo el contenido debes registrarte o iniciar sesión
        </p>
        <div className="flex gap-4">
          <a href="/login" className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded">
            Iniciar Sesión
          </a>
          <a href="/register" className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded">
            Registrarse
          </a>
        </div>
      </div>
    );
  }