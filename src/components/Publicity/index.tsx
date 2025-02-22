import SiruxImg from "../../assets/siriux.png";
import SitioWebImg from "../../assets/sitioweb.png";

export const Publicity = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <a
        href="https://wa.me/573008607992"
        target="_blank"
        rel="noreferrer"
        className="group relative overflow-hidden rounded-lg bg-black/20 transition-transform hover:scale-105"
      >
        <div className="aspect-[16/4] w-full">
          <img
            src={SiruxImg}
            alt="Siriux"
            className="h-full w-full object-contain"
          />
        </div>
      </a>
      <a
        href="https://wa.me/573004048012"
        target="_blank"
        rel="noreferrer"
        className="group relative overflow-hidden rounded-lg bg-black/20 transition-transform hover:scale-105"
      >
        <div className="aspect-[16/4] w-full">
          <img
            src={SitioWebImg}
            alt="Sitio Web"
            className="h-full w-full object-contain"
          />
        </div>
      </a>
    </div>
  );
};
