import { useState, useEffect } from "react";
import PlanetView from "./PlanetView";

export default function PlanetGallery({ initialPlanets }) {
  const [planets, setPlanets] = useState(initialPlanets);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const current = planets[currentIndex];

  const fetchMore = async () => {
    setLoading(true);
    const offset = planets.length;
    const API_URL = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+5+pl_name,discoverymethod,pl_orbper,pl_dens,pl_eqt,sy_snum,sy_dist,disc_year,pl_rade,pl_masse+from+ps+order+by+disc_year+desc+offset+${offset}&format=json`;

    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPlanets([...planets, ...data]);
      setCurrentIndex(currentIndex + 1);
    } catch (e) {
      console.error("Error en telemetría:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex === planets.length - 1) {
      fetchMore();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  if (!current) return null;

  // Cálculos rápidos
  const distLY = (current.sy_dist * 3.262).toFixed(1);
  const isHot = current.pl_eqt > 500;

  return (
    <section className="w-screen h-screen relative flex items-center justify-center bg-black text-white overflow-hidden">
      {/* HUD SUPERIOR: NOMBRE */}
      <div className="absolute left-12 top-12 md:left-16 md:top-16 z-20">
        <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.4em] mb-1">
          Nombre_Id
        </p>
        <h1 className="text-5xl md:text-7xl font-light italic uppercase leading-none tracking-tighter">
          {current.pl_name}
        </h1>
        <h3 className="text-lg font-mono opacity-60 mt-2">
          Año_descubrimiento:{" "}
          <span className="text-white">{current.disc_year || "???"}</span>
        </h3>
      </div>

      {/* HUD IZQUIERDA: DATOS FÍSICOS */}
      <div className="absolute left-12 md:left-16 top-1/2 -translate-y-1/2 z-20 space-y-10">
        {[
          {
            label: "Radio_Planetario",
            val: current.pl_rade?.toFixed(2),
            unit: "R⊕",
          },
          {
            label: "Masa_Estimada",
            val: current.pl_masse?.toFixed(2),
            unit: "M⊕",
          },
          {
            label: "Densidad_G/CM³",
            val: current.pl_dens?.toFixed(2),
            unit: "",
          },
          {
            label: "Temp_Equilibrio",
            val: current.pl_eqt,
            unit: "K",
            hot: isHot,
          },
        ].map((item, i) => (
          <div key={i} className="border-l-2 border-white/40 pl-4">
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
              {item.label}
            </p>
            <p
              className={`text-3xl font-light ${item.hot ? "text-amber-400" : "text-white"}`}
            >
              {item.val || "---"}{" "}
              <span className="text-xs opacity-50">{item.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* HUD DERECHA: ORBITA Y DISTANCIA */}
      <div className="absolute right-12 top-12 md:right-16 md:top-16 text-right z-20">
        <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.4em] mb-1">
          Duración_año
        </p>
        <div className="flex items-baseline justify-end gap-2">
          <span className="text-4xl font-light">
            {current.pl_orbper?.toFixed(1) || "???"}
          </span>
          <span className="text-xs font-mono opacity-60 uppercase">Days</span>
        </div>
      </div>

      {/* HUD INFERIOR IZQUIERDA: MÉTODO DE DESCUBRIMIENTO */}
      <div className="absolute left-12 bottom-12 md:left-16 md:bottom-16 z-20">
        <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.4em] mb-1">
          Método_Detección
        </p>
        <p className="text-xl font-light tracking-wide uppercase border-l-2 border-white pl-4">
          {current.discoverymethod || "Sensor_Error"}
        </p>
      </div>

      <div className="absolute right-12 bottom-12 md:right-16 md:bottom-16 text-right z-20">
        <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.4em] mb-1">
          Distancia_Sol
        </p>
        <div className="flex items-baseline justify-end gap-2">
          <span className="text-4xl font-light">{distLY}</span>
          <span className="text-xs font-mono opacity-60 uppercase">
            Años_Luz
          </span>
        </div>
      </div>

      {/* BOTONES DE NAVEGACIÓN */}
      <div className="absolute right-12 md:right-16 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="group flex items-center justify-center w-14 h-14 border border-white/20 rounded-full hover:border-white/60 transition-all disabled:opacity-0 bg-black/20 backdrop-blur-sm active:scale-95"
        >
          <span className="text-white opacity-40 group-hover:opacity-100">
            ↑
          </span>
        </button>
        <button
          onClick={handleNext}
          className="group flex items-center justify-center w-14 h-14 border border-white/20 rounded-full hover:border-white/60 transition-all bg-black/20 backdrop-blur-sm active:scale-95"
        >
          <span className="text-white opacity-40 group-hover:opacity-100">
            {loading ? "..." : "↓"}
          </span>
        </button>
      </div>

      {/* PLANETA 3D (Background) */}
      <div className="absolute inset-0 z-0">
        <PlanetView
          key={current.pl_name}
          radius={current.pl_rade || 9.5}
          density={current.pl_dens || 1.2}
          temp={current.pl_eqt || 600}
        />
      </div>
    </section>
  );
}
