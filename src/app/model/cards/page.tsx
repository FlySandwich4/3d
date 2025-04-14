"use client";

import * as THREE from "three";
import { useRef, useState, ComponentProps, JSX } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Image,
	Environment,
	ScrollControls,
	useScroll,
	useTexture,
	OrbitControls,
	Scroll,
} from "@react-three/drei";
import { easing } from "maath";
// import "/images/thinkingCat.jpg"
import "@/util";
import { PianoModel } from "@/components/piano";

export default function Page() {
	return (
		<Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
			<fog attach="fog" args={["#a79", 8.5, 12]} />
			<ScrollControls pages={4}>
				<Rig rotation={[0, 0, 0.15]}>
					<Carousel />
				</Rig>
				<ScrollControls pages={4}>
					<Rig rotation={[0, 0, 0.15]}>
						<Carousel />
					</Rig>
				</ScrollControls>
			</ScrollControls>
			<fog attach="fog" args={["#a79", 8.5, 12]} />

			<Environment preset="dawn" background blur={0.5} />
		</Canvas>
	);
}

type RigProps = JSX.IntrinsicElements["group"];

function Rig(props: RigProps) {
	const ref = useRef<THREE.Group>(null);
	const scroll = useScroll();

	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
		if (state.events?.update) {
			state.events.update();
		}
		easing.damp3(
			state.camera.position,
			[-state.pointer.x * 2, state.pointer.y + 1.5, 10],
			0.3,
			delta
		);
		state.camera.lookAt(0, 0, 0);
	});

	return <group ref={ref} {...props} />;
}

type CarouselProps = {
	radius?: number;
	count?: number;
};

function Carousel({ radius = 1.4, count = 7 }: CarouselProps) {
	return (
		<>
			{Array.from({ length: count }, (_, i) => (
				<Card
					key={i}
					url={`/images/p${(i % 2) + 1}.jpg`}
					position={[
						Math.sin((i / count) * Math.PI * 2) * radius,
						0,
						Math.cos((i / count) * Math.PI * 2) * radius,
					]}
					rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
				/>
			))}
		</>
	);
}

type CardProps = JSX.IntrinsicElements["group"] & {
	url: string;
};

function Card({ url, ...props }: CardProps) {
	const ref =
		useRef<
			THREE.Mesh<
				THREE.BufferGeometry<THREE.NormalBufferAttributes>,
				THREE.Material,
				THREE.Object3DEventMap
			>
		>(null); // Explicitly typing the ref to match the expected type
	const [hovered, setHovered] = useState(false);

	const pointerOver = (e: Event) => {
		e.stopPropagation();
		setHovered(true);
	};

	const pointerOut = () => setHovered(false);

	useFrame((state, delta) => {
		if (!ref.current) return;
		easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
		easing.damp(
			ref.current.material,
			"radius",
			hovered ? 0.25 : 0.1,
			0.2,
			delta
		);
		easing.damp(ref.current.material, "zoom", hovered ? 1 : 1.5, 0.2, delta);
	});

	return (
		<Image
			ref={ref}
			url={url}
			transparent
			side={THREE.DoubleSide}
			onPointerOver={pointerOver}
			onPointerOut={pointerOut}
			{...props}
		>
			{/* <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} /> */}
		</Image>
	);
}
