"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { XR, createXRStore, useXR } from "@react-three/xr";
import { PianoModel } from "@/components/piano";
import { Environment, OrbitControls } from "@react-three/drei";

const store = createXRStore();

function SceneContent() {
	const isPresenting= useXR().mode == "immersive-ar"; // this tells us if we're in XR mode
  console.log(isPresenting);

	return (
		<group position={isPresenting ? [0, 1.6, -3] : [0, 0, 2]}>
			<PianoModel />
			<Environment preset="sunset" background />
	  <OrbitControls enabled={isPresenting} />
		</group>
	);
}

export default function Page() {
	const [red, setRed] = useState(false);
	return (
		<>
			<Canvas>
				<Suspense fallback={null}>
					<XR store={store}>
						<SceneContent />
					</XR>
				</Suspense>
			</Canvas>
		</>
	);
}
