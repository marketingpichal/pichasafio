import TestimonioVid from "../../assets/testimonio.mp4";

interface VideoProps {
  src: string | undefined;
  title: string;
  className?: string;
}

const Video = ({ src, title, className }: VideoProps) => {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl bg-gray-800">
      <video
        src={src}
        title={title}
        className={`h-full w-full object-cover ${className}`}
        controls
        preload="metadata"
      />
    </div>
  );
};

export const Testimonial = () => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 font-poppins-bold">
          Testimonios Reales
        </h2>
        <p className="text-gray-300 text-sm sm:text-base font-poppins-light">
          Escucha las experiencias de nuestros usuarios
        </p>
      </div>
      
      <div className="w-full">
        <Video
          src={TestimonioVid}
          title="Testimonios de usuarios"
          className="w-full"
        />
      </div>
      
      <div className="text-center">
        <p className="text-gray-400 text-xs sm:text-sm font-poppins-light">
          Los resultados pueden variar. Consulta con un profesional de la salud.
        </p>
      </div>
    </div>
  );
};
