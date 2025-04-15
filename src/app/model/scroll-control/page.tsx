"use client";

import {
	Box,
	Html,
	Scroll,
	ScrollControls,
	useScroll,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";

import * as THREE from "three";

export default function Page() {
	return (
		<Canvas>
			<ambientLight intensity={0.1} />
			<group>
				<ScrollControlPage />
			</group>
		</Canvas>
	);
}

const ScrollControlPage = () => {
	return (
		<ScrollControls pages={3} damping={0.1}>
			{/* Canvas contents in here will *not* scroll, but receive useScroll! */}
			{/* <SomeModel /> */}
			<Scroll>
				{/* Canvas contents in here will scroll along */}
				<Foo a={"wewewe"} position={[0, 0, 0]} />
				<Foo position={[0, -3, 0]} />
				<Foo position={[0, -6, 0]} />
			</Scroll>
			<Scroll html>
				<div>
					{/* DOM contents in here will scroll along */}
					<h1>html in here (optional)</h1>
					<h1 style={{ top: "100vh" }}>second page</h1>
					<h1 style={{ top: "200vh" }}>third page</h1>
				</div>
			</Scroll>
		</ScrollControls>
	);
};

function Foo(props: any) {
	const ref = useRef<THREE.Mesh | null>(null);
	const data = useScroll();
	useFrame(() => {
		// data.offset = current scroll position, between 0 and 1, dampened
		// data.delta = current delta, between 0 and 1, dampened

		// Will be 0 when the scrollbar is at the starting position,
		// then increase to 1 until 1 / 3 of the scroll distance is reached
		const a = data.range(0, 1 / 3);
		// Will start increasing when 1 / 3 of the scroll distance is reached,
		// and reach 1 when it reaches 2 / 3rds.
		const b = data.range(1 / 3, 1 / 3);
		// Same as above but with a margin of 0.1 on both ends
		const c = data.range(1 / 3, 1 / 3, 0.1);
		// Will move between 0-1-0 for the selected range
		const d = data.curve(1 / 3, 1 / 3);
		// Same as above, but with a margin of 0.1 on both ends
		const e = data.curve(1 / 3, 1 / 3, 0.1);
		// Returns true if the offset is in range and false if it isn't
		const f = data.visible(2 / 3, 1 / 3);
		// The visible function can also receive a margin
		const g = data.visible(2 / 3, 1 / 3, 0.1);
	});
	return (
		<mesh ref={ref} {...props}>
			<boxGeometry args={[1, 1, 1]}>
				<Html>{props.a} ggggggggggggggggg</Html>
			</boxGeometry>
			<meshStandardMaterial />
		</mesh>
	);
}
