"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from '@react-three/drei';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Canvas shadows camera={{ position: [10, 10, 10], }}  className="min-h-[600px]">

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
    <Card className="grow grid">
      <CardContent>
        <Suspense fallback={(<ProjectModelViewSkeleton />)}>
          <ProjectModelViewInternal />
        </Suspense>
      </CardContent>
    </Card>
  );
}