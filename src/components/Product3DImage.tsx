import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh, Texture } from "three";

function base64ToTexture(base64: string): Promise<Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const texture = new Texture(img);
      texture.needsUpdate = true;
      resolve(texture);
    };
    img.onerror = reject;
    img.src = base64;
  });
}

function ImagePlane({ image }: { image: string }) {
  const mesh = useRef<Mesh>(null!);
  const { viewport } = useThree();
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    base64ToTexture(image).then(setTexture);
  }, [image]);

  const [width, height] = useMemo(() => {
    if (!texture?.image) return [1, 1];

    const img = texture.image as HTMLImageElement;
    const imgAspect = img.width / img.height;
    const viewAspect = viewport.width / viewport.height;

    if (imgAspect > viewAspect) {
      return [viewport.width, viewport.width / imgAspect];
    } else {
      return [viewport.height * imgAspect, viewport.height];
    }
  }, [texture, viewport]);

  useFrame(({ mouse }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = mouse.x * 0.25;
    mesh.current.rotation.x = -mouse.y * 0.25;
  });

  if (!texture) return null;

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
      <ImagePlane image={image} />
    </Canvas>
  );
}
