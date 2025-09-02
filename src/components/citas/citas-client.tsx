"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicTable } from "@/components/dynamic-table";
import DialogCreateCita from "@/components/citas/dialog-create-cita";
import DialogEditCita from "@/components/citas/dialog-edit-cita";
import DialogDeleteCita from "@/components/citas/dialog-delete-cita";
import DialogChangeEstadoCita from "@/components/citas/dialog-change-estado-cita";
import { getCitas } from "@/services/citasService";
import { toast } from "sonner";
import type { Cita } from "@/types";
import {
	Calendar,
	Clock,
	Users,
	CheckCircle,
	XCircle,
	AlertCircle,
	UserCheck,
	CalendarDays,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
	formatDateString,
	isToday,
	isThisMonth,
	isInNextDays,
} from "@/utils/dateUtils";

const CitasClient = ({ citas }: { citas: Cita[] }) => {
	const [loading, setLoading] = useState(true);

	// const loadCitas = async () => {
	// 	try {
	// 		setLoading(true);
	// 		const data = await getCitas();
	// 		setCitas(data);
	// 	} catch (error) {
	// 		toast.error("Error al cargar las citas");
	// 		console.error(error);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// useEffect(() => {
	// 	loadCitas();
	// }, []);

	// Función para obtener el nombre completo del paciente
	const getPacienteName = (cita: Cita) => {
		const usuario = cita.paciente_usuario;
		if (usuario) {
			return `${usuario.nombre} ${usuario.apellido_paterno || ""} ${
				usuario.apellido_materno || ""
			}`.trim();
		}
		return "Sin paciente";
	};

	// Función para obtener el nombre completo del médico
	const getMedicoName = (cita: Cita) => {
		const medico = cita.medico?.usuario;
		if (medico) {
			const nombreCompleto = `${medico.nombre} ${
				medico.apellido_paterno || ""
			} ${medico.apellido_materno || ""}`.trim();
			const especialidad = cita.medico?.especialidad?.nombre;
			return especialidad
				? `${nombreCompleto} - ${especialidad}`
				: nombreCompleto;
		}
		return "Sin médico";
	};

	// Función para formatear fecha
	const formatDate = formatDateString;

	// Calcular estadísticas
	const estadisticas = {
		total: citas.length,
		hoy: citas.filter((c) => c.fecha && isToday(c.fecha)).length,
		esteMes: citas.filter((c) => c.fecha && isThisMonth(c.fecha)).length,
		confirmadas: citas.filter((c) => c.estado === "confirmada").length,
		completadas: citas.filter((c) => c.estado === "completada").length,
		canceladas: citas.filter((c) => c.estado === "cancelada").length,
		pendientes: citas.filter((c) => c.estado === "pendiente").length,
		proximas: citas.filter(
			(c) =>
				c.fecha && isInNextDays(c.fecha, 7) && c.estado !== "cancelada"
		).length,
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
						<Calendar className="w-6 h-6 text-blue-600" />
						Gestionar Citas
					</h2>
					<p className="text-muted-foreground">
						Administra las citas médicas del sistema con
						estadísticas completas.
					</p>
				</div>
				<div className="flex justify-end gap-2">
					<Button className="bg-blue-900" asChild>
						<Link href="/reportes/citas">Ver Reporte</Link>
					</Button>
					<DialogCreateCita />
				</div>
			</div>

			{/* Estadísticas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Citas
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{estadisticas.total}
						</div>
						<p className="text-xs text-muted-foreground">
							Todas las citas registradas
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Citas Hoy
						</CardTitle>
						<CalendarDays className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{estadisticas.hoy}
						</div>
						<p className="text-xs text-muted-foreground">
							Citas programadas para hoy
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Este Mes
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{estadisticas.esteMes}
						</div>
						<p className="text-xs text-muted-foreground">
							Citas del mes actual
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Próximas (7 días)
						</CardTitle>
						<AlertCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{estadisticas.proximas}
						</div>
						<p className="text-xs text-muted-foreground">
							Citas próximas confirmadas
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Estadísticas por estado */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Confirmadas
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{estadisticas.confirmadas}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Completadas
						</CardTitle>
						<UserCheck className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{estadisticas.completadas}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pendientes
						</CardTitle>
						<Clock className="h-4 w-4 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{estadisticas.pendientes}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Canceladas
						</CardTitle>
						<XCircle className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{estadisticas.canceladas}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabla de citas */}
			<Card>
				<CardHeader>
					<CardTitle>Citas Médicas</CardTitle>
				</CardHeader>
				<CardContent>
					<DynamicTable
						data={citas}
						columns={[
							{ key: "id_cita", label: "ID" },
							{
								key: "paciente_usuario",
								label: "Paciente",
								render: (row: any) => getPacienteName(row),
							},
							{
								key: "medico_nombre",
								label: "Médico",
								render: (row: any) => getMedicoName(row),
							},
							{
								key: "fecha",
								label: "Fecha",
								render: (row: any) => formatDate(row.fecha),
							},
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
										[key: string]: {
											label: string;
											color: string;
										};
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
							{
								key: "motivo",
								label: "Motivo",
								render: (row: any) => {
									if (row.motivo) {
										return (
											<span className="max-w-xs truncate block">
												{row.motivo}
											</span>
										);
									}
									return (
										<span className="text-gray-400">
											Sin motivo
										</span>
									);
								},
							},
							{
								key: "consultorio",
								label: "Consultorio",
								render: (row: any) =>
									row.consultorio || "No asignado",
							},
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
				</CardContent>
			</Card>
		</div>
	);
};

export default CitasClient;
