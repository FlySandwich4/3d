// 'use client';

import fs from "fs";
import path from "path";
import Link from "next/link";
import * as scrollUtil from "@/scrollUtil";

export default function Page() {
	const basePath = path.join(process.cwd(), "src/app/model");
	const subFolders = fs
		.readdirSync(basePath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	console.log("1", scrollUtil.getPageToInterval(5, 1, 0.5))
	console.log("1", scrollUtil.getPageToInterval(5, 1, 3))
	console.log("1", scrollUtil.getPageToInterval(5, 1, -1))
	console.log("1", scrollUtil.getPageToInterval(5, 4, 0))
	console.log("1", scrollUtil.getPageToInterval(1, 0, 0))
	console.log("1", scrollUtil.getPageToInterval(5, 3, 0.25))

	console.log("w", scrollUtil.getPartialPageIntervalLength(3, 0.5))
	console.log("w", scrollUtil.getPartialPageIntervalLength(5, 3))
	console.log("w", scrollUtil.getPartialPageIntervalLength(1, 0))



	return (
		<div className="flex mx-12 flex-col justify-center items-center">
			<h1 className="mt-8 text-2xl font-bold">Index of Subfolders</h1>
			{subFolders.map((folder) => (
				<div className="w-full" key={folder}>
					<Link href={`/model/${folder}`}>
					
						<div className="my-2 px-4 py-4 bg-blue-200 hover:scale-101 transition-transform duration-200 rounded-lg
						 text-blue-800 text-[1.2rem] font-bold">
							{">  "}{folder}
						</div>
					</Link>
				</div>
			))}
		</div>
	);
}
