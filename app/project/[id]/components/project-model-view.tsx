"use client"

import { Canvas } from "@react-three/fiber";

export default function ProjectModelView({ project, }: { project: any }) {
  return (
    <div className="border rounded-lg h-[500px]">
      <Canvas
        shadows
        className=""
        camera={{
          position: [10, 10, 10],
        }}
      >
        <ambientLight color={"white"} intensity={0.3} />
        <directionalLight color="white" position={[0, 2, 5]} />
        <mesh receiveShadow={true} castShadow  position={[0, 0, 0]}>
          <boxGeometry args={[6, 10, 10]} />
          <meshPhysicalMaterial color="red" />
        </mesh>
      </Canvas>
    </div>
  );
}