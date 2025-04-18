"use client";

import * as THREE from "three";
import { useRef, useState, ComponentProps, JSX, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Image,
	Environment,
	ScrollControls,
	useScroll,
	useTexture,
	OrbitControls,
	Scroll,
	ImageProps,
	Html,
	Text,
} from "@react-three/drei";
import { easing } from "maath";
// import "/images/thinkingCat.jpg"
import "@/util";
import { PianoModel } from "@/components/piano";
import { motion } from "framer-motion";
import { getPageToInterval } from "@/scrollUtil";

export default function Page() {
	return (
		<Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
			<fog attach="fog" args={["#a79", 8.5, 12]} />
			<ScrollControls pages={5}>
				<Rig rotation={[0, 0, 0.15]}>
					<Carousel />
				</Rig>
				<PianoSection />
				<Scroll html>
					<div className="flex flex-col items-center w-screen absolute">
						<Section>
							<h1 style={{ fontSize: "4rem", color: "#fff" }}>
								1 Page Content 🎉
							</h1>
						</Section>
						<Section>
							<h1 style={{ fontSize: "4rem", color: "#fff" }}>
								2 Page Content 🎉
							</h1>
						</Section>
						<Section>
							<h1 style={{ fontSize: "4rem", color: "#fff" }}>
								3 Page Content 🎉
							</h1>
						</Section>
						<Section>
							<h1 style={{ fontSize: "4rem", color: "#fff" }}>
								4 Page Content 🎉
							</h1>
						</Section>
						<Section>
							<h1 style={{ fontSize: "4rem", color: "#fff" }}>Contact us 🎉</h1>
						</Section>
					</div>
				</Scroll>
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

	useEffect(() => {
		console.log(scroll); // Log the scroll offset
	}, [scroll]); // Add scroll.offset as a dependency

	useFrame((state, delta) => {
		const fadeOut = scroll.range(0.5, 0.25);
		const fade = 1 - fadeOut; // Inverts so 1 -> 0

		// console.log(scroll.offset); // Log the scroll offset

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

		const position: THREE.Vector3 = ref.current.position;
		easing.damp3(ref.current.position, [0, 3 * fadeOut, 0], 0.1, delta);
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
	const ref = useRef<THREE.Mesh>(null); // Adjusted to use a single type argument
	const [hovered, setHovered] = useState(false);
	const scroll = useScroll();

	const pointerOver = (e: Event) => {
		e.stopPropagation();
		setHovered(true);
	};

	const pointerOut = () => setHovered(false);

	useFrame((state, delta) => {
		if (!ref.current) return;

		const inView = scroll.range(0, 0.75); // Cards fully visible during pages 0-3
		const fadeOut = scroll.range(0.5, 0.25); // Fade out between 3 and 4

		// Fade and scale logic
		const targetScale = hovered ? 1.15 : 1;
		const fade = 1 - fadeOut; // Inverts so 1 -> 0

		// Apply fading out
		(ref.current.material as THREE.MeshBasicMaterial).opacity = fade;
		(ref.current.material as THREE.MeshBasicMaterial).transparent = true;

		// Optionally, scale down during fade
		easing.damp3(ref.current.scale, targetScale * fade, 0.1, delta);
	});

	return (
		<Image
			// @ts-ignore
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

function Section({ children }: { children: React.ReactNode }): JSX.Element {
	return (
		<div className="h-screen w-screen flex flex-col items-start justify-center mx-auto outline-white outline-2">
			{children}
		</div>
	);
}

function PianoSection() {
	const scroll = useScroll();
	const groupRef = useRef<THREE.Group>(null);

	const appearAnimationInterval = getPageToInterval(scroll.pages, 2, 1);
	const disappearAnimationInterval = getPageToInterval(scroll.pages, 3.5, 0.5);

	useFrame((state, delta) => {
		const appear = scroll.range(
			appearAnimationInterval.start,
			appearAnimationInterval.end - appearAnimationInterval.start
		); // scroll.range(start, length)
		const eased = easing.linear(appear); // smoother

		const disappear = scroll.range(
			disappearAnimationInterval.start,
			disappearAnimationInterval.end - disappearAnimationInterval.start
		);

		const eased2 = easing.linear(disappear); // smoother

		if (groupRef.current) {
			if (eased2 <= 0) {
				easing.damp3(
					groupRef.current.position,
					[0.5, -5 + 5 * eased, 0],
					0.1,
					delta
				);
				easing.damp3(groupRef.current.scale, [eased, eased, eased], 0.1, delta);
			}

			easing.damp3(
				groupRef.current.scale,
				[1 - eased2, 1 - eased2, 1 - eased2],
				0.1,
				delta
			);
		}
	});

	return (
		<group position={[0.5, 0, 0]} ref={groupRef}>
			<PianoModel />
			<Text
				fontSize={1}
				color="white"
				position={[0, 0, -10]}
				anchorY="middle"
				anchorX="center"
			>
				233e1212e1212e1
			</Text>
		</group>
	);
}
