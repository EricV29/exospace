import React, { useEffect, useState, useMemo } from "react";

const NUM_STARS = 350;

export default function Starfield() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Generamos las estrellas una sola vez
  const stars = useMemo(() => {
    return Array.from({ length: NUM_STARS }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      // depth determina qué tanto se mueve con el mouse (Parallax)
      depth: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2, // Para el parpadeo
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalizamos la posición: -1 a 1
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-10 bg-black overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            // El truco del 3D: translate3d para usar la GPU
            transform: `translate3d(${mouse.x * (25 / star.depth)}px, ${mouse.y * (25 / star.depth)}px, 0)`,
            transition: "transform 0.1s ease-out",
            opacity: 0.8,
            boxShadow: star.size > 1.5 ? "0 0 10px white" : "none",
          }}
        />
      ))}
      {/* Capa de atmósfera (vignette) para dar profundidad central */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_120%)]" />
    </div>
  );
}
