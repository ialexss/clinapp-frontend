import { Suspense } from "react";
import CitasClient from "@/components/citas/citas-client";
import { Calendar } from "lucide-react";
import { getCitas } from "@/services/citasService";

const pageCitas = async () => {
	const citas = await getCitas();

	return (
		<div className="space-y-6">
			<Suspense
				fallback={
					<div className="flex justify-center items-center h-64">
						<div className="text-lg">Cargando citas...</div>
					</div>
				}
			>
				<CitasClient citas={citas} />
			</Suspense>
		</div>
	);
};

export default pageCitas;
