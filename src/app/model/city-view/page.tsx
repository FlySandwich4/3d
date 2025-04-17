"use client";

import {
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
			{/* <PianoModel /> */}
			<ScrollControls pages={3} damping={0.5} distance={1}>
				<City />
				{/* <Html
					position={[-14124.39, -3356.9, -23296.83]}
					rotation={[0, 0, 0]}
					transform={false}
				>
					{" "}
					<div className="text-6xl text-white font-bold"> weafawfwa </div>
				</Html> */}

				<Text3D
					curveSegments={32}
					position={[0,0,0]}
					bevelEnabled
					bevelSize={0.04}
					bevelThickness={0.1}
					height={0.5}
					lineHeight={0.5}
					letterSpacing={-0.06}
					size={1.5}
					font="/Inter_Bold.json"
				>
					{`hello\nworld`}
					<meshNormalMaterial />
				</Text3D>
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

	useFrame((state, delta) => {
		const t = scrollData.offset; // normalized scroll position (0 to 1)
		// From and To positions
		const from = new Vector3(-50705.31, 146.03, -86191.36);
		const to = new Vector3(-54124.39, 4356.9, -23296.83);

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
			position={[-33000, 0,-50000]}
			rotation={[0,Math.PI * 5/4,0]}
			curveSegments={322}
			bevelEnabled
			bevelSize={0.04}
			bevelThickness={0.1}
			height={12}
			lineHeight={0.5}
			letterSpacing={-0.06}
			size={1000}
			font="/Inter_Bold.json"
		>
			{`hello\nworld`}
			<meshNormalMaterial />
		</Text3D>
	);
}