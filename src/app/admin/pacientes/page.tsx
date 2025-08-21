import React from "react";
import { getPacientes } from "@/services/pacientesService";
import { DynamicTable } from "@/components/dynamic-table";
import DialogCreatePaciente from "@/components/pacientes/dialog-create-paciente";
import DialogEditPaciente from "@/components/pacientes/dialog-edit-paciente";
import DialogDeletePaciente from "@/components/pacientes/dialog-delete-paciente";

const pagePacientes = async () => {
	const pacientes = await getPacientes();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
				<p className="text-muted-foreground">
					Administra los pacientes del sistema.
				</p>
			</div>
			<DialogCreatePaciente />
			<DynamicTable
				data={pacientes}
				columns={[
					{ key: "id_paciente", label: "ID" },
					{ key: "id_usuario", label: "Id Usuario" },
					{ key: "ci", label: "CI" },
					{ key: "fecha_nac", label: "Fecha Nac" },
					{ key: "sexo", label: "Sexo" },
					{ key: "telefono", label: "Teléfono" },
					{ key: "email", label: "Email" },
					{
						key: "actions",
						label: "Acciones",
						visible: true,
						render: (row: any) => (
							<div className="flex gap-2">
								<DialogEditPaciente paciente={row} />
								<DialogDeletePaciente paciente={row} />
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

export default pagePacientes;
