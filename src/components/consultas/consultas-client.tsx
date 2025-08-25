"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getConsultas } from "@/services/consultasService";
import type { Consulta } from "@/types";
import DialogCreateConsulta from "@/components/consultas/dialog-create-consulta";
import DialogEditConsulta from "@/components/consultas/dialog-edit-consulta";
import DialogDeleteConsulta from "@/components/consultas/dialog-delete-consulta";
import { Stethoscope, Calendar, FileText, TestTube } from "lucide-react";

const ConsultasClient = () => {
	const [consultas, setConsultas] = useState<Consulta[]>([]);
	const [loading, setLoading] = useState(true);

	const loadConsultas = async () => {
		try {
			setLoading(true);
			const data = await getConsultas();
			setConsultas(data);
		} catch (error) {
			toast.error("Error al cargar las consultas");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadConsultas();
	}, []);

	// Función para obtener el nombre completo del paciente
	const getPacienteName = (consulta: Consulta) => {
		if (consulta.paciente?.usuario) {
			return `${consulta.paciente.usuario.nombre} ${
				consulta.paciente.usuario.apellido_paterno || ""
			} ${consulta.paciente.usuario.apellido_materno || ""}`.trim();
		}
		if (consulta.cita?.usuario) {
			return `${consulta.cita.usuario.nombre} ${
				consulta.cita.usuario.apellido_paterno || ""
			} ${consulta.cita.usuario.apellido_materno || ""}`.trim();
		}
		return "Paciente desconocido";
	};

	// Función para obtener el nombre completo del médico
	const getMedicoName = (consulta: Consulta) => {
		if (consulta.medicoUser) {
			return `${consulta.medicoUser.nombre} ${
				consulta.medicoUser.apellido_paterno || ""
			} ${consulta.medicoUser.apellido_materno || ""}`.trim();
		}
		if (consulta.cita?.medico?.usuario) {
			return `${consulta.cita.medico.usuario.nombre} ${
				consulta.cita.medico.usuario.apellido_paterno || ""
			} ${consulta.cita.medico.usuario.apellido_materno || ""}`.trim();
		}
		return "Médico desconocido";
	};

	// Función para formatear fecha
	const formatDate = (dateString?: string | null) => {
		if (!dateString) return "No registrada";
		try {
			return new Date(dateString).toLocaleDateString("es-ES", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		} catch {
			return "Fecha inválida";
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex justify-center items-center h-64">
					<div className="text-lg">Cargando consultas...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-2">
						<Stethoscope className="w-8 h-8 text-blue-600" />
						Gestión de Consultas Médicas
					</h1>
					<p className="text-gray-600 mt-2">
						Administra las consultas médicas, diagnósticos y
						análisis de laboratorio
					</p>
				</div>
				<DialogCreateConsulta onConsultaCreated={loadConsultas} />
			</div>

			{/* Estadísticas rápidas */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Consultas
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{consultas.length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Con Análisis
						</CardTitle>
						<TestTube className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{
								consultas.filter(
									(c) => c.analisis && c.analisis.length > 0
								).length
							}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Este Mes
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{
								consultas.filter((c) => {
									if (!c.fecha_registro) return false;
									const fecha = new Date(c.fecha_registro);
									const ahora = new Date();
									return (
										fecha.getMonth() === ahora.getMonth() &&
										fecha.getFullYear() ===
											ahora.getFullYear()
									);
								}).length
							}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Próximas Citas
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{
								consultas.filter((c) => {
									if (!c.proxima_cita) return false;
									const proximaCita = new Date(
										c.proxima_cita
									);
									const ahora = new Date();
									return proximaCita > ahora;
								}).length
							}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabla de consultas */}
			<Card>
				<CardHeader>
					<CardTitle>Lista de Consultas</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Paciente</TableHead>
									<TableHead>Médico</TableHead>
									<TableHead>Cita ID</TableHead>
									<TableHead>Motivo</TableHead>
									<TableHead>Diagnóstico</TableHead>
									<TableHead>Análisis</TableHead>
									<TableHead>Fecha Registro</TableHead>
									<TableHead>Próxima Cita</TableHead>
									<TableHead>Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{consultas.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={10}
											className="text-center py-8"
										>
											<div className="flex flex-col items-center gap-2">
												<Stethoscope className="w-12 h-12 text-gray-400" />
												<p className="text-lg font-medium text-gray-600">
													No hay consultas registradas
												</p>
												<p className="text-sm text-gray-500">
													Crea la primera consulta
													médica
												</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									consultas.map((consulta) => (
										<TableRow key={consulta.id_consulta}>
											<TableCell className="font-medium">
												{consulta.id_consulta}
											</TableCell>
											<TableCell>
												{getPacienteName(consulta)}
											</TableCell>
											<TableCell>
												{getMedicoName(consulta)}
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													#{consulta.id_cita}
												</Badge>
											</TableCell>
											<TableCell>
												{consulta.motivo ? (
													<span className="max-w-xs truncate block">
														{consulta.motivo}
													</span>
												) : (
													<span className="text-gray-400">
														Sin motivo
													</span>
												)}
											</TableCell>
											<TableCell>
												{consulta.diagnostico ? (
													<span className="max-w-xs truncate block">
														{consulta.diagnostico}
													</span>
												) : (
													<span className="text-gray-400">
														Sin diagnóstico
													</span>
												)}
											</TableCell>
											<TableCell>
												{consulta.analisis &&
												consulta.analisis.length > 0 ? (
													<Badge
														variant="secondary"
														className="bg-green-100 text-green-800"
													>
														{
															consulta.analisis
																.length
														}{" "}
														análisis
													</Badge>
												) : (
													<Badge
														variant="outline"
														className="text-gray-500"
													>
														Sin análisis
													</Badge>
												)}
											</TableCell>
											<TableCell>
												{formatDate(
													consulta.fecha_registro
												)}
											</TableCell>
											<TableCell>
												{consulta.proxima_cita ? (
													<Badge
														variant="outline"
														className="bg-blue-50 text-blue-700"
													>
														{formatDate(
															consulta.proxima_cita
														)}
													</Badge>
												) : (
													<span className="text-gray-400">
														No programada
													</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<DialogEditConsulta
														consulta={consulta}
														onConsultaUpdated={
															loadConsultas
														}
													/>
													<DialogDeleteConsulta
														consulta={consulta}
														onConsultaDeleted={
															loadConsultas
														}
													/>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ConsultasClient;
