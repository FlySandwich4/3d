"use client";

import {
	Center,
	GizmoHelper,
	GizmoViewport,
	Html,
	OrbitControls,
	ScrollControls,
	Text,
	Text3D,
	useScroll,
} from "@react-three/drei";
import { CityModel } from "./city";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BoxGeometry, Vector3 } from "three";
import { useRef } from "react";
import { PianoModel } from "@/components/piano";
import { easing } from "maath"; // <- part of drei/maath
import * as THREE from "three";
import { DragControls } from "framer-motion";

export default function Page() {
	return (
		<Canvas
			camera={{
				position: [-50700, 146, -80000],
				fov: 15,
				near: 1,
				far: 1000000,
			}}
		>
			{/* <OrbitControls /> */}
			{/* <PianoModel /> */}
			<ScrollControls pages={5} damping={0.5} distance={1} maxSpeed={0.25}>
				<City />
				{/* <Html
					position={[-14124.39, -3356.9, -23296.83]}
					rotation={[0, 0, 0]}
					transform={false}
				>
					{" "}
					<div className="text-6xl text-white font-bold"> weafawfwa </div>
				</Html> */}

				<FloatingText3D />
			</ScrollControls>

			{/* <CameraLogger /> */}
			<directionalLight position={[10, 10, 10]} intensity={2} castShadow />

			{/* <OrbitControls /> */}
		</Canvas>
	);
}

function CameraLogger() {
	const { camera } = useThree();

	useFrame(() => {
		console.log("Camera position:", camera.position);
		console.log("Camera rotation:", camera.rotation);
	});
	return null;
}

function City() {
	const ref = useRef<THREE.Group>(null);
	const scrollData = useScroll();

	const { camera } = useThree();

	const targetPosition = useRef(new Vector3());

	const from = new Vector3(-50705.31, 146.03, -86191.36);
	const to = new Vector3(-84124.39, 4356.9, 673296.83);

	useFrame((state, delta) => {
		const t = scrollData.offset; // normalized scroll position (0 to 1)
		// From and To positions

		// Interpolate between from → to based on scroll
		targetPosition.current.lerpVectors(from, to, t);

		// Smoothly move camera toward that position
		easing.damp3(camera.position, targetPosition.current, 0.3, delta);

		// Optional: Keep camera looking at a fixed point (adjust if needed)
		camera.lookAt(0, 0, 0);
	});

	return (
		<>
			<group ref={ref}>
				<CityModel />
				{/* <Html
					position={[-14124.39, -3356.9, -23296.83]}
					rotation={[0, 0, 0]}
					transform={false}
				>
					{" "}
					<div className="text-6xl text-white font-bold"> weafawfwa </div>
				</Html> */}
			</group>
		</>
	);
}

function FloatingText3D() {
	const ref = useRef<THREE.Mesh>(null);

	return (
		<Text3D
			ref={ref}
			position={[-13000, 0, -10000]}
			rotation={[0, (Math.PI * 5) / 4, 0]}
			curveSegments={322}
			bevelEnabled
			bevelSize={0.04}
			bevelThickness={0.1}
			height={12}
			lineHeight={0.5}
			letterSpacing={-0.06}
			size={4000}
			font="/Inter_Bold.json"
		>
			{`hello\nworld`}
			<meshNormalMaterial />
		</Text3D>
	);
}
