"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from '@react-three/drei';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'


export default function ProjectModelView({ project, }: { project: any }) {

  const obj = useLoader(OBJLoader, '/Bambo_House.obj');

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

        <primitive receiveShadow={true} castShadow object={obj} position={[-5, -2, 6]} />

        <mesh receiveShadow={true} castShadow  position={[-13, 2, 0]}>
          <boxGeometry args={[6, 10, 10]} />
          <meshPhysicalMaterial color="red" />
        </mesh>

        <OrbitControls enableDamping={false} />
        {/* <Stats /> */}
      </Canvas>
    </div>
  );
}