import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  GradientTexture,
  Float,
} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

export default function PlanetView({ radius, density, temp }: any) {
  const r = radius || 9.5;
  const d = density || 1.2;
  const t = temp || 600;

  const visualSize = Math.min(Math.max(r * 0.35, 2), 4.5);
  const isGasGiant = d < 3.5;

  const colorStops = isGasGiant
    ? ["#330000", "#ff4400", "#ffcc00"]
    : ["#111111", "#444444", "#ffffff"];

  return (
    <div className="w-full h-full">
      {/* 2. CÁMARA: Bajamos el FOV a 35 para un efecto de zoom óptico más potente */}
      <Canvas camera={{ position: [0, 0, 15], fov: 35 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          {/* 3. ILUMINACIÓN: Subimos la intensidad para "quemar" los grises */}
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
          <spotLight
            position={[-10, -10, 10]}
            intensity={1.5}
            color="#ffaa00"
          />

          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <Sphere args={[visualSize, 300, 300]}>
              <MeshDistortMaterial
                speed={isGasGiant ? 1.2 : 0}
                distort={isGasGiant ? 0.08 : 0}
                roughness={0.3}
                metalness={0.1}
                emissive="#220000"
                emissiveIntensity={0.4}
                wireframe={false}
              >
                <GradientTexture stops={[0, 0.5, 1]} colors={colorStops} />
              </MeshDistortMaterial>
            </Sphere>

            {/* Atmósfera sutil (Sin bordes grises) */}
            <Sphere args={[visualSize * 1.02, 100, 100]}>
              <meshBasicMaterial
                color="#ff6600"
                transparent
                opacity={0.05}
                side={THREE.BackSide}
              />
            </Sphere>
          </Float>

          {/* 4. CONTROLES DE SUPER ZOOM */}
          <OrbitControls
            enableZoom={true}
            minDistance={4}
            maxDistance={30}
            enablePan={false}
            makeDefault
            autoRotate
            autoRotateSpeed={0.4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
