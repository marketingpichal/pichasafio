import ProductCard from './productCard';

export default function SexShop() {
  const telefono = "573008607992"; // cambia este número por tu WhatsApp Business

  const productos = [
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417627/PICHA_INFINITA_2.0_wmpphz.png", nombre: "PICHA INFINITA 2.0" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417627/ENANO_PATRON_COMB_brz9oq.png", nombre: "ENANO PATRON COMB" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417627/TABLETAS_XBULL_c8af3t.png", nombre: "TABLETAS XBULL" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417626/WARZONE_PICHAL_im7kpm.jpg", nombre: "WARZONE PICHAL" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417626/TORO_Y_LEON_onpaol.jpg", nombre: "TORO Y LEON" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417625/WARZONE_PICHAL_2.0_wy6lsv.jpg", nombre: "WARZONE PICHAL 2.0" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417624/MIEL_b73prl.jpg", nombre: "MIEL" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417624/GTA69_ytij3v.jpg", nombre: "GTA69" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417623/MULTI_PLACER_qfgtuo.jpg", nombre: "MULTI PLACER" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417623/VITAMINAS_tqnnvb.jpg", nombre: "VITAMINAS" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417623/EL_MATADOR_CAPSULAS_andha4.jpg", nombre: "EL MATADOR CAPSULAS" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417623/XBULL_SACHETS_kijktg.jpg", nombre: "XBULL SACHETS" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417622/PICHA_INFINITA_gmj4th.jpg", nombre: "PICHA INFINITA" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417621/MERO_MACHI_frbsug.jpg", nombre: "MERO MACHI" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417621/POTENCIADOR_dhw1ah.jpg", nombre: "POTENCIADOR" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417621/MINERO_CRAFT_ojkuta.jpg", nombre: "MINERO CRAFT" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417620/KIT_SALVAVIDAS_y9pydh.jpg", nombre: "KIT SALVAVIDAS" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417620/RASTA_CULION_vsp5p9.jpg", nombre: "RASTA CULION" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417620/ELECTRIZANTE_kdufgd.jpg", nombre: "ELECTRIZANTE" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417620/TARRO_DE_TRIPLE_MACA_bzxdg5.jpg", nombre: "TARRO DE TRIPLE MACA" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417619/DARK_SOULAPADAS_rpus1m.jpg", nombre: "DARK SOULAPADAS" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417619/EL_MATADOR_tdwjho.jpg", nombre: "EL MATADOR" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417619/ENANO_PICHON_uifcrk.jpg", nombre: "ENANO PICHON" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417618/ENVIOS_INTERNACIONALES_vk0yyv.jpg", nombre: "ENVIOS INTERNACIONALES" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417618/COMBO_RASTA_CULION_2.0_hajvax.jpg", nombre: "COMBO RASTA CULION 2.0" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417617/EXPLOSION_TOTAL_t0p13v.jpg", nombre: "EXPLOSION TOTAL" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417617/FERMIN_ihdkct.jpg", nombre: "FERMIN" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417617/FRASCOS_XBULL_gn2zpo.jpg", nombre: "FRASCOS XBULL" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417617/LA_BICHOTA_zqt6nf.jpg", nombre: "LA BICHOTA" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417617/LITRO_DE_SHILAHIT_pziafs.jpg", nombre: "LITRO DE SHILAHIT" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417617/COMBO_SHILAHIT_pdrlvj.jpg", nombre: "COMBO SHILAHIT" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417617/COMBO_MULTIPLACER_wj7jvj.jpg", nombre: "COMBO MULTIPLACER" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417616/COMBO_X_BULL_sya0ie.jpg", nombre: "COMBO X BULL" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417616/JMAICAN_STRONG_ybh5hn.jpg", nombre: "JMAICAN STRONG" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417616/TEX_yw2zrz.jpg", nombre: "TEX" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417616/COMBO_PATRON_br0mvl.jpg", nombre: "COMBO PATRON" },
    { img: "https://res.cloudinary.com/dueqbhnpa/image/upload/v1755417616/SACHET_XBULL_MUJER_cuip3q.jpg", nombre: "SACHET XBULL MUJER" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {productos.map((producto, i) => (
          <ProductCard
            key={i}
            img={producto.img}
            nombre={producto.nombre}
            telefono={telefono}
          />
        ))}
      </div>
    </div>
  );
}
