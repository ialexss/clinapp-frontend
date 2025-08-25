import React from "react";
import { getCitas } from "@/services/citasService";
import { DynamicTable } from "@/components/dynamic-table";
import DialogCreateCita from "@/components/citas/dialog-create-cita";
import DialogEditCita from "@/components/citas/dialog-edit-cita";
import DialogDeleteCita from "@/components/citas/dialog-delete-cita";
import DialogChangeEstadoCita from "@/components/citas/dialog-change-estado-cita";

const pageCitas = async () => {
	const citas = await getCitas();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Citas</h2>
				<p className="text-muted-foreground">
					Administra las citas médicas del sistema.
				</p>
			</div>
			<DialogCreateCita />
			<DynamicTable
				data={citas}
				columns={[
					{ key: "id_cita", label: "ID" },
					{
						key: "paciente_usuario",
						label: "Paciente",
						render: (row: any) => {
							const usuario = row.paciente_usuario;
							if (usuario) {
								return `${usuario.nombre} ${
									usuario.apellido_paterno || ""
								} ${usuario.apellido_materno || ""}`.trim();
							}
							return "Sin paciente";
						},
					},
					{
						key: "medico_nombre",
						label: "Médico",
						render: (row: any) => {
							const medico = row.medico?.usuario;
							if (medico) {
								const nombreCompleto = `${medico.nombre} ${
									medico.apellido_paterno || ""
								} ${medico.apellido_materno || ""}`.trim();
								const especialidad =
									row.medico?.especialidad?.nombre;
								return especialidad
									? `${nombreCompleto} - ${especialidad}`
									: nombreCompleto;
							}
							return "Sin médico";
						},
					},
					{ key: "fecha", label: "Fecha" },
					{
						key: "horario",
						label: "Horario",
						render: (row: any) => {
							if (row.hora_inicio && row.hora_fin) {
								return `${row.hora_inicio} - ${row.hora_fin}`;
							}
							return "Sin horario";
						},
					},
					{
						key: "estado",
						label: "Estado",
						render: (row: any) => {
							const estado = row.estado || "pendiente";
							const estadoMap: {
								[key: string]: { label: string; color: string };
							} = {
								pendiente: {
									label: "Pendiente",
									color: "bg-yellow-100 text-yellow-800",
								},
								confirmada: {
									label: "Confirmada",
									color: "bg-blue-100 text-blue-800",
								},
								en_curso: {
									label: "En Curso",
									color: "bg-purple-100 text-purple-800",
								},
								completada: {
									label: "Completada",
									color: "bg-green-100 text-green-800",
								},
								cancelada: {
									label: "Cancelada",
									color: "bg-red-100 text-red-800",
								},
								no_asistio: {
									label: "No Asistió",
									color: "bg-gray-100 text-gray-800",
								},
							};
							const estadoInfo = estadoMap[estado] || {
								label: estado,
								color: "bg-gray-100 text-gray-800",
							};
							return (
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}
								>
									{estadoInfo.label}
								</span>
							);
						},
					},
					{ key: "motivo", label: "Motivo" },
					{ key: "consultorio", label: "Consultorio" },
					{
						key: "actions",
						label: "Acciones",
						visible: true,
						render: (row: any) => (
							<div className="flex gap-2">
								<DialogChangeEstadoCita cita={row} />
								<DialogEditCita cita={row} />
								<DialogDeleteCita cita={row} />
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

export default pageCitas;
