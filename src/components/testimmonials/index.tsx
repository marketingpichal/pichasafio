import TestimonioVid from "../../assets/testimonio.mp4";
interface VideoProps {
  src: string | undefined;
  title: string;
  className?: string;
}

const Video = ({ src, title, className }: VideoProps) => {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-xl">
      <iframe
        src={src}
        title={title}
        className={`h-full w-full ${className}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export const Testimonial = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-white md:text-3xl">Testimonios</h2>
      <Video
        src={TestimonioVid}
        title="Testimonios de usuarios"
        className="w-full"
      />
    </div>
  );
};
