import { Suspense } from "react";
import ConsultasClient from "@/components/consultas/consultas-client";
import { Stethoscope } from "lucide-react";

const pageConsultas = () => {
	return (
		<div className="space-y-6">
			<Suspense
				fallback={
					<div className="flex justify-center items-center h-64">
						<div className="text-lg">Cargando consultas...</div>
					</div>
				}
			>
				<ConsultasClient />
			</Suspense>
		</div>
	);
};

export default pageConsultas;
