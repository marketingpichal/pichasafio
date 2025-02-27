/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef } from "react";

interface JuicyAdProps {
  adZoneId: string;
}

export default function JuicyAd({ adZoneId }: JuicyAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = `https://js.juicyads.com/jp.php?c=${adZoneId}&u=http%3A%2F%2Fwww.juicyads.rocks`;
  //   script.async = true;
  //   script.type = "text/javascript";

  //   document.body.appendChild(script);

  //   return () => {
  //     if (script.parentNode) {
  //       document.body.removeChild(script);
  //     }
  //   };
  // }, []);
  console.log(adZoneId);
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
        Pichasafio Patrocinado
      </h3>
      <div
        ref={adRef}
        className="min-h-[250px] w-full flex justify-center"
      ></div>
    </div>
  );
}
