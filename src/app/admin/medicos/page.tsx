import React from "react";
import { getMedicos } from "@/services/medicosService";
import { DynamicTable } from "@/components/dynamic-table";
import DialogCreateMedico from "@/components/medicos/dialog-create-medico";
import DialogEditMedico from "@/components/medicos/dialog-edit-medico";
import DialogDeleteMedico from "@/components/medicos/dialog-delete-medico";

const pageMedicos = async () => {
	const medicos = await getMedicos();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Médicos</h2>
				<p className="text-muted-foreground">
					Administra los médicos del sistema.
				</p>
			</div>
			<DialogCreateMedico />
			<DynamicTable
				data={medicos}
				columns={[
					{ key: "id_medico", label: "ID" },
					{ key: "id_usuario", label: "Id Usuario" },
					{ key: "id_especialidad", label: "Id Especialidad" },
					{ key: "telefono", label: "Teléfono" },
					{ key: "email", label: "Email" },
					{
						key: "actions",
						label: "Acciones",
						visible: true,
						render: (row) => (
							<div className="flex gap-2">
								<DialogEditMedico medico={row} />
								<DialogDeleteMedico medico={row} />
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

export default pageMedicos;
