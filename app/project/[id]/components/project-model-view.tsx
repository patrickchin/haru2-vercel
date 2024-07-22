"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, Gltf } from "@react-three/drei";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

function ProjectModelViewSkeleton({ text }: { text?: string }) {
  return (
    <div className="h-full flex justify-center items-center">
      {text ?? "Loading model view ..."}
    </div>
  );
}

function ProjectModelDefault() {
  const mtl = useLoader(MTLLoader, "/api/github/Condo.mtl");
  const obj = useLoader(OBJLoader, "/api/github/Condo.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });
  return (
    <primitive
      receiveShadow={true}
      castShadow
      object={obj}
      rotation={[Math.PI / 2, Math.PI, 0]}
    />
  );
}

function ProjectModelViewInternal() {
  try {
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

        <ProjectModelDefault />

        <OrbitControls enableDamping={false} />
        <Stats />
      </Canvas>
    );
  } catch (e) {
    return (
      <ProjectModelViewSkeleton text="Failed to load default model from Github." />
    );
  }
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
