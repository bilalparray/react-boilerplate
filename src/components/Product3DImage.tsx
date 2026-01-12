import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef, useMemo } from "react";
import { Mesh } from "three";

function ImagePlane({ url }: { url: string }) {
  const mesh = useRef<Mesh>(null!);
  const texture = useLoader(TextureLoader, url);
  const { viewport } = useThree();

  const [width, height] = useMemo(() => {
    const img = texture.image;
    const imgAspect = img.width / img.height;
    const viewAspect = viewport.width / viewport.height;

    if (imgAspect > viewAspect) {
      return [viewport.width, viewport.width / imgAspect];
    } else {
      return [viewport.height * imgAspect, viewport.height];
    }
  }, [texture, viewport]);

  useFrame(({ mouse }) => {
    mesh.current.rotation.y = mouse.x * 0.25;
    mesh.current.rotation.x = -mouse.y * 0.25;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

export function Product3DImage({ image }: { image: string }) {
  return (
    <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 10] }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <ImagePlane url={image} />
    </Canvas>
  );
}
