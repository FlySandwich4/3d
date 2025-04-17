// 'use client';

import fs from "fs";
import path from "path";
import Link from "next/link";

export default function Page() {
	const basePath = path.join(process.cwd(), "src/app/model");
	const subFolders = fs
		.readdirSync(basePath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

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
