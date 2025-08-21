import React from "react";
import { getEspecialidades } from "@/services/especialidadesService";
import { DynamicTable } from "@/components/dynamic-table";
import DialogCreateEspecialidad from "@/components/especialidades/dialog-create-especialidad";
import DialogEditEspecialidad from "@/components/especialidades/dialog-edit-especialidad";
import DialogDeleteEspecialidad from "@/components/especialidades/dialog-delete-especialidad";

const pageEspecialidades = async () => {
	const especialidades = await getEspecialidades();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					Especialidades
				</h2>
				<p className="text-muted-foreground">
					Gestiona las especialidades.
				</p>
			</div>
			<DialogCreateEspecialidad />
			<DynamicTable
				data={especialidades}
				columns={[
					{ key: "id_especialidad", label: "ID" },
					{ key: "nombre", label: "Nombre" },
					{ key: "descripcion", label: "Descripción" },
					{
						key: "actions",
						label: "Acciones",
						visible: true,
						render: (row: any) => (
							<div className="flex gap-2">
								<DialogEditEspecialidad especialidad={row} />
								<DialogDeleteEspecialidad especialidad={row} />
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

export default pageEspecialidades;
