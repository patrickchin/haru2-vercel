"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stats, Gltf } from "@react-three/drei";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
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
  // const obj = useLoader(OBJLoader, '/Bambo_House.obj');
  // const loader = new GLTFLoader();
  // const obj = loader.load(
  //   'models/gltf/duck/duck.gltf');

  // const model = useGLTF("DiffuseTransmissionPlant.glb");

  return (
    <Canvas
      shadows
      camera={{ position: [0.0, 0.4, 0.8] }}
      className="min-h-[600px]"
    >
      <ambientLight color={"white"} intensity={0.3} />
      <directionalLight color="white" position={[0, 2, 5]} />

      <Gltf
        src="/tmp/DiffuseTransmissionPlant.glb"
        receiveShadow
        castShadow
        position={[0, -0.3, 0]}
      />

      {/* <primitive object={model.scene} /> */}
      {/* <primitive receiveShadow={true} castShadow object={obj} position={[-5, -2, 6]} /> */}

      {/* <mesh receiveShadow={true} castShadow position={[-13, 2, 0]}>
        <boxGeometry args={[6, 10, 10]} />
        <meshPhysicalMaterial color="red" />
      </mesh> */}

      <OrbitControls enableDamping={false} />
      <Stats />
    </Canvas>
  );
}

export default function ProjectModelView() {
  return (
    <Card className="grow grid">
      <CardContent>
        <Suspense fallback={<ProjectModelViewSkeleton />}>
          <ProjectModelViewInternal />
        </Suspense>
      </CardContent>
    </Card>
  );
}
