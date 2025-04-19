"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { JSX, Suspense, useRef, useState } from "react";
import { easing } from "maath";
import { XR, createXRStore, useXR } from "@react-three/xr";
import { PianoModel } from "@/components/piano";
import {
	Center,
	Environment,
	Html,
	OrbitControls,
	PerspectiveCamera,
	Scroll,
	ScrollControls,
	Text,
	TextProps,
	useScroll,
} from "@react-three/drei";
import { CityModel } from "../city-view/city";
import {
	Group,
	Vector2,
	Vector3,
	Scene,
	MeshStandardMaterial,
	Material,
} from "three";
import { motion } from "framer-motion";
import { getPageToInterval } from "@/scrollUtil";
import { Exo_2 } from "next/font/google";

const store = createXRStore();

function SceneContent({ onReady }: { onReady: () => void }) {
	const isPresenting = useXR().mode == "immersive-ar";
	const groupRef = useRef<Group>(null);
	const [intensity, setIntensity] = useState(1);
	const isRendering = useRef(false);
	const { scene } = useThree();
	const textRef = useRef<TextProps>(null);

	// const mouse = useRef(new Vector2());

	const { camera, gl, pointer } = useThree();
	const scroll = useScroll();
	const rotateInterval = getPageToInterval(scroll.pages, 1, 1);

	useFrame((state, delta) => {
		const range = scroll.range(
			rotateInterval.start,
			rotateInterval.end - rotateInterval.start
		);
		easing.damp(camera.rotation, "y", -pointer.x * 0.1, 0.2, delta);
		easing.damp(camera.rotation, "x", pointer.y * 0.1, 0.2, delta);
		easing.damp(
			groupRef.current!.rotation,
			"x",
			(-range * Math.PI * 1) / 6,
			0.2,
			delta
		);
		if (!isRendering.current) {
			isRendering.current = true;
			onReady();
		}
		// easing.damp3(textRef.current?.position, [0, 0, 0], 0.1, delta);
		// Optional: tweak curve to match visual expectation
		const i = 1 - range * 0.8; // reduce intensity as range goes from 0 → 1
		if (scene.backgroundIntensity == i) {
			return;
		}
		scene.backgroundIntensity = i;
		console.log("Intensity:", i);
	});

	return (
		<group ref={groupRef} position={isPresenting ? [0, 1.6, -3] : [0, 0, 2]}>
			<PerspectiveCamera makeDefault fov={90} position={[-2, 0, 3]} />
			<Text ref={textRef} rotation={[0, 0.6, 0]} scale={2}>
				we are
			</Text>
			<Environment
				files={"/images/river.hdr"}
				background
				backgroundIntensity={intensity}
			></Environment>
		</group>
	);
}

export default function Page() {
	const [sceneReady, setSceneReady] = useState(false);
	const [red, setRed] = useState(false);
	return (
		<>
			<Canvas>
				<Suspense fallback={null}>
					<XR store={store}>
						<ScrollControls pages={5} distance={0.2}>
							<SceneContent onReady={() => setSceneReady(true)} />

							<Scroll html>
								<div className="flex flex-col items-center w-screen absolute">
									<Section>
										<h1 style={{ fontSize: "4rem", color: "#fff" }}>
											1 Page Content 🎉
										</h1>
									</Section>
									<Section>
										<div className="w-96 h-full">
											<Card>
												<div className="flex justify-center items-center w-full h-full p-4">
													<h1 style={{ fontSize: "4rem", color: "black" }}>
														2 Page Content 🎉
													</h1>
												</div>
											</Card>
										</div>
									</Section>
									<Section>
										<h1 style={{ fontSize: "4rem", color: "#fff" }}>
											3 Page Content 🎉
										</h1>
									</Section>
									<Section>
										<Card>
											<h1 style={{ fontSize: "4rem", color: "#fff" }}>
												4 Page Content 🎉
											</h1>
										</Card>
									</Section>
									<Section>
										<h1 style={{ fontSize: "4rem", color: "#fff" }}>
											Contact us 🎉
										</h1>
									</Section>
								</div>
							</Scroll>
						</ScrollControls>
					</XR>
				</Suspense>
			</Canvas>
			{sceneReady && (
				<motion.div
					className="absolute top-0 w-full max-w-screen h-12"
					initial={{ opacity: 0, y: 200 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1.4, ease: "easeInOut", delay: 0.5 }}
				>
					<div className=" bg-blue-500 rounded-sm m-2 flex justify-end">
						<button
							className=" text-blue-800 px-4 py-2 m-2 bg-blue-200 rounded font-bold"
							onClick={() => setRed((prev) => !prev)}
						>
							Menu
						</button>
					</div>
				</motion.div>
			)}
		</>
	);
}

function Section({ children }: { children: React.ReactNode }): JSX.Element {
	return (
		<div className="h-screen w-screen flex flex-col items-start justify-center mx-auto outline-white outline-2">
			{children}
		</div>
	);
}

function Card({ children }: { children: React.ReactNode }): JSX.Element {
	return (
		<div className="w-full h-full overflow-clip flex flex-col p-4">
			{/* <div className="h-24"></div> */}
			<div className="rounded-2xl bg-white h-full">{children}</div>
		</div>
	);
}
