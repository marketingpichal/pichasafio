import SiruxImg from "../../assets/siriux.png";
import SitioWebImg from "../../assets/sitioweb.png";

export const Publicity = () => {
  return (
    <section className="w-full flex flex-row gap-4 p-4 bg-gray-900">
      <a
        href="https://wa.me/573008607992"
        target="_blank"
        rel="noreferrer"
        className="w-1/2 flex items-center justify-center"
      >
        <div className="relative w-full aspect-[16/4] overflow-hidden">
          <img 
            src={SiruxImg} 
            alt="Siriux"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </a>
      <a
        href="https://wa.me/573004048012"
        target="_blank"
        rel="noreferrer"
        className="w-1/2 flex items-center justify-center"
      >
        <div className="relative w-full aspect-[16/4] overflow-hidden">
          <img 
            src={SitioWebImg} 
            alt="Sitio Web"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </a>
    </section>
  );
};