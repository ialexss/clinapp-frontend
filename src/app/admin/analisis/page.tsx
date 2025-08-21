import React from "react";
import { getAnalisis } from "@/services/analisisService";
import { DynamicTable } from "@/components/dynamic-table";
import DialogCreateAnalisis from "@/components/analisis/dialog-create-analisis";
import DialogEditAnalisis from "@/components/analisis/dialog-edit-analisis";
import DialogDeleteAnalisis from "@/components/analisis/dialog-delete-analisis";

const pageAnalisis = async () => {
	const analisis = await getAnalisis();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Análisis</h2>
				<p className="text-muted-foreground">
					Gestiona los análisis de laboratorio.
				</p>
			</div>
			<DialogCreateAnalisis />
			<DynamicTable
				data={analisis}
				columns={[
					{ key: "id_analisis", label: "ID" },
					{ key: "id_consulta", label: "Id Consulta" },
					{ key: "tipo", label: "Tipo" },
					{ key: "resultado", label: "Resultado" },
					{ key: "fecha", label: "Fecha" },
					{
						key: "actions",
						label: "Acciones",
						visible: true,
						render: (row: any) => (
							<div className="flex gap-2">
								<DialogEditAnalisis analisis={row} />
								<DialogDeleteAnalisis analisis={row} />
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

export default pageAnalisis;
