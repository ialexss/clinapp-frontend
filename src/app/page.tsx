import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-br from-[#fdfbfb] via-[#ebedee] to-[#d7dde8]">
			<div className="max-w-md bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl">
				<h1 className="text-3xl font-black mb-4 text-gray-800">
					CLINAP
				</h1>
				<p className="text-gray-600 mb-8">
					Gestiona tus citas médicas y tratamientos de manera fácil y
					rápida.
				</p>

				<Link href="/admin" passHref>
					<Button className="text-white bg-black hover:bg-gray-800 transition">
						Iniciar
					</Button>
				</Link>
			</div>
		</div>
	);
}
