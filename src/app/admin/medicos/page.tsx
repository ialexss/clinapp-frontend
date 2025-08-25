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
					{
						key: "nombre_completo",
						label: "Nombre Completo",
						render: (row: any) => {
							const usuario = row.usuario;
							if (usuario) {
								const nombreCompleto = [
									usuario.nombre,
									usuario.apellido_paterno,
									usuario.apellido_materno,
								]
									.filter(Boolean)
									.join(" ");
								return nombreCompleto || "Sin nombre";
							}
							return "Sin usuario";
						},
					},
					{
						key: "especialidad_nombre",
						label: "Especialidad",
						render: (row: any) =>
							row.especialidad?.nombre || "Sin especialidad",
					},
					{ key: "telefono", label: "Teléfono" },
					{
						key: "email_usuario",
						label: "Email",
						render: (row: any) =>
							row.usuario?.email || row.email || "Sin email",
					},
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
