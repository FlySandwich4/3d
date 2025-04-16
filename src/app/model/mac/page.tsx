"use client";

import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

function Mac(props: any) {
	const group = useRef<THREE.Group>(null);
	const { nodes, materials } = useGLTF("/mac-draco.glb");
	// Make it float
	useFrame((state) => {
		if (!group.current) return;
		const t = state.clock.getElapsedTime();
		group.current.rotation.x = THREE.MathUtils.lerp(
			group.current.rotation.x,
			Math.cos(t / 2) / 20 + 0.25,
			0.1
		);
		group.current.rotation.y = THREE.MathUtils.lerp(
			group.current.rotation.y,
			Math.sin(t / 4) / 20,
			0.1
		);
		group.current.rotation.z = THREE.MathUtils.lerp(
			group.current.rotation.z,
			Math.sin(t / 8) / 20,
			0.1
		);
		group.current.position.y = THREE.MathUtils.lerp(
			group.current.position.y,
			(-2 + Math.sin(t / 2)) / 2,
			0.1
		);
	});

	return (
		<group ref={group} {...props} dispose={null}>
			<group rotation-x={-0.425} position={[0, -0.04, 0.41]}>
				<motion.group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
					<mesh
						material={materials.aluminium}
						geometry={(nodes["Cube008"] as THREE.Mesh).geometry}
					/>
					<mesh
						material={materials["matte.001"]}
						geometry={(nodes["Cube008_1"] as THREE.Mesh).geometry}
					/>
					<mesh geometry={(nodes["Cube008_2"] as THREE.Mesh).geometry}>
						{/* Drei's HTML component can "hide behind" canvas geometry */}
						<Html
							className="content"
							rotation-x={-Math.PI / 2}
							position={[0, 0.05, -0.09]}
							transform
							occlude
						>
							<div
								className="wrapper"
								onPointerDown={(e) => e.stopPropagation()}
							>
								<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=Hv-AJkhZ0-XCrwTi"></iframe>
							</div>
						</Html>
					</mesh>
				</motion.group>
			</group>
			<mesh
				material={materials.keys}
				geometry={(nodes.keyboard as THREE.Mesh).geometry}
				position={[1.79, 0, 3.45]}
			/>
			<group position={[0, -0.1, 3.39]}>
				<mesh
					material={materials.aluminium}
					geometry={(nodes["Cube002"] as THREE.Mesh).geometry}
				/>
				<mesh
					material={materials.trackpad}
					geometry={(nodes["Cube002_1"] as THREE.Mesh).geometry}
				/>
			</group>
			<mesh
				material={materials.touchbar}
				geometry={(nodes.touchbar as THREE.Mesh).geometry}
				position={[0, -0.03, 1.2]}
			/>
		</group>
	);
}

export default function Page() {
	return (
		<Canvas camera={{ position: [-5, 0, -15], fov: 50 }}>
			<pointLight position={[10, 10, 10]} intensity={1.5} />
			<group rotation={[0, Math.PI, 0]} position={[0, 1, 0]}>
				<Mac />
			</group>

			<Environment preset="city" />
			<OrbitControls
				enablePan={false}
				enableZoom={false}
				minPolarAngle={Math.PI / 2.2}
				maxPolarAngle={Math.PI / 2.2}
			/>
		</Canvas>
	);
}
