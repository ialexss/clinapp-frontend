import { Suspense } from "react";
import CitasClient from "@/components/citas/citas-client";
import { Calendar } from "lucide-react";

const pageCitas = () => {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
					<Calendar className="w-6 h-6 text-blue-600" />
					Gestionar Citas
				</h2>
				<p className="text-muted-foreground">
					Administra las citas médicas del sistema con estadísticas completas.
				</p>
			</div>
			<Suspense fallback={
				<div className="flex justify-center items-center h-64">
					<div className="text-lg">Cargando citas...</div>
				</div>
			}>
				<CitasClient />
			</Suspense>
		</div>
	);
};

export default pageCitas;
