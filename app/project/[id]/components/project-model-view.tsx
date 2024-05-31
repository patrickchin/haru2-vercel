"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, Gltf } from "@react-three/drei";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
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

  const mtl = useLoader(MTLLoader, "/api/github/Condo.mtl");
  const obj = useLoader(OBJLoader,  "/api/github/Condo.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  return (
    <Canvas
      shadows
      camera={{ position: [0, 40, 80] }}
      className="min-h-[600px]"
    >
      <ambientLight color="white" intensity={0.9} />
      <directionalLight color="orange" position={[0, 40, 80]} />

      {/* <Gltf
        src="/tmp/DiffuseTransmissionPlant.glb"
        receiveShadow
        castShadow
        position={[0, -0.3, 0]}
      /> */}

      <primitive
        receiveShadow={true}
        castShadow
        object={obj}
        rotation={[Math.PI/2, Math.PI, 0]}
      />

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
