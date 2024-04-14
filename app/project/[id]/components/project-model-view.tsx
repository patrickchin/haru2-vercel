"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from '@react-three/drei';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { Suspense } from "react";

function ProjectModelViewSkeleton() {
  return (
    <div className="h-full flex justify-center items-center">
      Loading model view ...
    </div>
  );
}

function ProjectModelViewInternal() {
  const obj = useLoader(OBJLoader, '/Bambo_House.obj');

  return (
    <Canvas className="" shadows camera={{ position: [10, 10, 10], }} >

      <ambientLight color={"white"} intensity={0.3} />
      <directionalLight color="white" position={[0, 2, 5]} />

      <primitive receiveShadow={true} castShadow object={obj} position={[-5, -2, 6]} />

      <mesh receiveShadow={true} castShadow position={[-13, 2, 0]}>
        <boxGeometry args={[6, 10, 10]} />
        <meshPhysicalMaterial color="red" />
      </mesh>

      <OrbitControls enableDamping={false} />
      {/* <Stats /> */}
    </Canvas>
  );
}

export default function ProjectModelView() {
  return (
    <div className="border rounded-lg h-[500px]">
      <Suspense fallback={(<ProjectModelViewSkeleton />)}>
        <ProjectModelViewInternal />
      </Suspense>
    </div>
  );
}