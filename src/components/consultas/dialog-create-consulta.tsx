"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createConsulta } from "@/services/consultasService";
import { getCitas } from "@/services/citasService";
import { getPacientesUsuarios } from "@/services/usersService";
import { getPacientes } from "@/services/pacientesService";
import { getMedicos } from "@/services/medicosService";
import { TIPOS_ANALISIS, CATEGORIAS_ANALISIS } from "@/data/tiposAnalisis";
import type {
	Consulta,
	Cita,
	Usuario,
	Medico,
	Paciente,
	AnalisisLaboratorio,
} from "@/types";
import { Plus, Trash2, TestTube, Stethoscope, Calendar } from "lucide-react";

interface DialogCreateConsultaProps {
	onConsultaCreated: () => void;
}

interface FormData {
	id_cita: number;
	id_usuario: number; // médico
	id_paciente: number;
	motivo: string;
	diagnostico: string;
	tratamiento: string;
	indicaciones: string;
	proxima_cita: string;
	analisis: Partial<AnalisisLaboratorio>[];
}

const DialogCreateConsulta = ({
	onConsultaCreated,
}: DialogCreateConsultaProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [citas, setCitas] = useState<Cita[]>([]);
	const [pacientes, setPacientes] = useState<Usuario[]>([]);
	const [pacientesCompletos, setPacientesCompletos] = useState<Paciente[]>(
		[]
	);
	const [medicos, setMedicos] = useState<Medico[]>([]);
	const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
		control,
	} = useForm<FormData>({
		defaultValues: {
			analisis: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "analisis",
	});

	const selectedCitaId = watch("id_cita");

	useEffect(() => {
		if (isOpen) {
			loadData();
		}
	}, [isOpen]);

	useEffect(() => {
		if (selectedCitaId) {
			const cita = citas.find(
				(c) => c.id_cita === Number(selectedCitaId)
			);
			setSelectedCita(cita || null);

			if (cita) {
				// Buscar el paciente correcto usando el id_usuario de la cita
				const pacienteCompleto = pacientesCompletos.find(
					(p) => p.id_usuario === cita.id_usuario
				);

				if (pacienteCompleto) {
					setValue("id_paciente", pacienteCompleto.id_paciente);
				}

				// Establecer automáticamente el médico de la cita seleccionada
				if (cita.id_medico && cita.medico?.usuario?.id_usuario) {
					setValue("id_usuario", cita.medico.usuario.id_usuario);
				}

				setValue("motivo", cita.motivo || "");
			}
		}
	}, [selectedCitaId, citas, pacientesCompletos, setValue]);

	const loadData = async () => {
		try {
			const [citasData, pacientesData, pacientesCompletos, medicosData] =
				await Promise.all([
					getCitas(),
					getPacientesUsuarios(),
					getPacientes(),
					getMedicos(),
				]);
			setCitas(citasData);
			setPacientes(pacientesData);
			setPacientesCompletos(pacientesCompletos);
			setMedicos(medicosData);
		} catch (error) {
			toast.error("Error al cargar los datos");
			console.error(error);
		}
	};

	const onSubmit = async (data: FormData) => {
		setLoading(true);
		try {
			// Convertir FormData a formato del backend
			const consultaData = {
				id_cita: data.id_cita,
				id_usuario: data.id_usuario,
				id_paciente: data.id_paciente,
				motivo: data.motivo || null,
				diagnostico: data.diagnostico || null,
				tratamiento: data.tratamiento || null,
				indicaciones: data.indicaciones || null,
				proxima_cita: data.proxima_cita || null,
				analisis: data.analisis.filter((a) => a.tipo), // Solo incluir análisis con tipo definido
			};

			await createConsulta(consultaData);
			toast.success("Consulta creada exitosamente");
			reset();
			setIsOpen(false);
			onConsultaCreated();
		} catch (error: any) {
			toast.error(error.message || "Error al crear la consulta");
		} finally {
			setLoading(false);
		}
	};

	const addAnalisis = () => {
		append({
			tipo: "",
			resultado: "",
			observaciones: "",
			fecha: new Date().toISOString().split("T")[0],
		});
	};

	const getPacienteName = (usuario: Usuario) => {
		return `${usuario.nombre} ${usuario.apellido_paterno || ""} ${
			usuario.apellido_materno || ""
		}`.trim();
	};

	const getMedicoName = (medico: Medico) => {
		if (medico.usuario) {
			return `${medico.usuario.nombre} ${
				medico.usuario.apellido_paterno || ""
			} ${medico.usuario.apellido_materno || ""}`.trim();
		}
		return `Médico ID: ${medico.id_medico}`;
	};

	const getCitaDisplay = (cita: Cita) => {
		const pacienteName = cita.usuario
			? getPacienteName(cita.usuario)
			: "Paciente desconocido";
		const medicoName = cita.medico?.usuario
			? getMedicoName(cita.medico)
			: "Médico desconocido";
		return `#${cita.id_cita} - (${cita.fecha} ${cita.hora_inicio})`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<Plus className="w-4 h-4" />
					Nueva Consulta
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Stethoscope className="w-5 h-5" />
						Crear Nueva Consulta Médica
					</DialogTitle>
					<DialogDescription>
						Registra una nueva consulta médica con diagnóstico,
						tratamiento y análisis de laboratorio.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Información básica */}
					<div className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="id_cita">Cita Médica *</Label>
							<Select
								value={watch("id_cita")?.toString() || ""}
								onValueChange={(value) =>
									setValue("id_cita", Number(value))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona una cita" />
								</SelectTrigger>
								<SelectContent>
									{citas.map((cita) => (
										<SelectItem
											key={cita.id_cita}
											value={cita.id_cita.toString()}
										>
											{getCitaDisplay(cita)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.id_cita && (
								<p className="text-red-500 text-sm mt-1">
									Este campo es requerido
								</p>
							)}
						</div>

						<div className="space-y-1">
							<Label htmlFor="id_usuario">Médico *</Label>
							<Select
								value={watch("id_usuario")?.toString() || ""}
								onValueChange={(value) =>
									setValue("id_usuario", Number(value))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona un médico" />
								</SelectTrigger>
								<SelectContent>
									{medicos.map((medico) => (
										<SelectItem
											key={medico.id_medico}
											value={
												medico.usuario?.id_usuario?.toString() ||
												""
											}
										>
											{getMedicoName(medico)}
											{medico.especialidad &&
												` - ${medico.especialidad.nombre}`}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.id_usuario && (
								<p className="text-red-500 text-sm mt-1">
									Este campo es requerido
								</p>
							)}
						</div>
					</div>

					{/* Información de la cita seleccionada */}
					{selectedCita && (
						<Card className="bg-blue-50 border-blue-200">
							<CardHeader>
								<CardTitle className="text-sm flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									Información de la Cita
								</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-2">
								<p>
									<strong>Paciente:</strong>{" "}
									{selectedCita.usuario
										? getPacienteName(selectedCita.usuario)
										: "No especificado"}
								</p>
								<p>
									<strong>Médico:</strong>{" "}
									{selectedCita.medico?.usuario
										? getMedicoName(selectedCita.medico)
										: "No especificado"}
								</p>
								<p>
									<strong>Fecha y Hora:</strong>{" "}
									{selectedCita.fecha} de{" "}
									{selectedCita.hora_inicio} a{" "}
									{selectedCita.hora_fin}
								</p>
								<div>
									<strong>Estado:</strong>{" "}
									<Badge variant="outline">
										{selectedCita.estado}
									</Badge>
								</div>
								{selectedCita.consultorio && (
									<p>
										<strong>Consultorio:</strong>{" "}
										{selectedCita.consultorio}
									</p>
								)}
							</CardContent>
						</Card>
					)}

					{/* Detalles de la consulta */}
					<div className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="motivo">
								Motivo de la Consulta
							</Label>
							<Input
								{...register("motivo")}
								placeholder="Describe el motivo de la consulta"
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="diagnostico">Diagnóstico</Label>
							<Textarea
								{...register("diagnostico")}
								placeholder="Diagnóstico médico detallado"
								rows={3}
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="tratamiento">Tratamiento</Label>
							<Textarea
								{...register("tratamiento")}
								placeholder="Tratamiento recomendado"
								rows={3}
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="indicaciones">Indicaciones</Label>
							<Textarea
								{...register("indicaciones")}
								placeholder="Indicaciones adicionales para el paciente"
								rows={2}
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="proxima_cita">Próxima Cita</Label>
							<Input type="date" {...register("proxima_cita")} />
						</div>
					</div>

					{/* Análisis de laboratorio */}
					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle className="flex items-center gap-2">
									<TestTube className="w-5 h-5" />
									Análisis de Laboratorio
								</CardTitle>
								<Button
									type="button"
									onClick={addAnalisis}
									variant="outline"
									size="sm"
								>
									<Plus className="w-4 h-4 mr-2" />
									Agregar Análisis
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{fields.length === 0 ? (
								<p className="text-gray-500 text-sm">
									No hay análisis agregados
								</p>
							) : (
								fields.map((field, index) => (
									<Card key={field.id} className="p-4">
										<div className="flex justify-between items-start mb-4">
											<h4 className="font-medium">
												Análisis #{index + 1}
											</h4>
											<Button
												type="button"
												onClick={() => remove(index)}
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
										<div className="space-y-4">
											<div>
												<Label
													htmlFor={`analisis.${index}.tipo`}
												>
													Tipo de Análisis *
												</Label>
												<Select
													onValueChange={(value) => {
														if (
															value === "custom"
														) {
															// No hacer nada, permitir que el usuario escriba en el input
															return;
														}
														const selectedAnalysis =
															TIPOS_ANALISIS.find(
																(t) =>
																	t.id ===
																	value
															);
														setValue(
															`analisis.${index}.tipo`,
															selectedAnalysis?.nombre ||
																value
														);
													}}
												>
													<SelectTrigger>
														<SelectValue placeholder="Selecciona un tipo de análisis" />
													</SelectTrigger>
													<SelectContent>
														{CATEGORIAS_ANALISIS.map(
															(categoria) => (
																<div
																	key={
																		categoria
																	}
																>
																	<div className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-100">
																		{
																			categoria
																		}
																	</div>
																	{TIPOS_ANALISIS.filter(
																		(
																			tipo
																		) =>
																			tipo.categoria ===
																			categoria
																	).map(
																		(
																			tipo
																		) => (
																			<SelectItem
																				key={
																					tipo.id
																				}
																				value={
																					tipo.id
																				}
																				className="pl-4"
																			>
																				<div className="p-2">
																					<div className="font-medium">
																						{
																							tipo.nombre
																						}
																					</div>
																					{tipo.descripcion && (
																						<div className="text-sm text-gray-500">
																							{
																								tipo.descripcion
																							}
																						</div>
																					)}
																				</div>
																			</SelectItem>
																		)
																	)}
																</div>
															)
														)}
														<div className="border-t border-gray-200 mt-2 pt-2">
															<SelectItem
																value="custom"
																className="font-medium"
															>
																💡 Escribir tipo
																personalizado
															</SelectItem>
														</div>
													</SelectContent>
												</Select>
												<div className="mt-2">
													<Input
														{...register(
															`analisis.${index}.tipo`,
															{ required: true }
														)}
														placeholder="O escribe un tipo personalizado..."
														className="text-sm"
													/>
												</div>
												{errors.analisis?.[index]
													?.tipo && (
													<p className="text-red-500 text-sm mt-1">
														Este campo es requerido
													</p>
												)}
											</div>
											<div>
												<Label
													htmlFor={`analisis.${index}.fecha`}
												>
													Fecha
												</Label>
												<Input
													type="date"
													{...register(
														`analisis.${index}.fecha`
													)}
												/>
											</div>
											<div>
												<Label
													htmlFor={`analisis.${index}.resultado`}
												>
													Resultado
												</Label>
												<Textarea
													{...register(
														`analisis.${index}.resultado`
													)}
													placeholder="Resultado del análisis"
													rows={2}
												/>
											</div>
											<div>
												<Label
													htmlFor={`analisis.${index}.observaciones`}
												>
													Observaciones
												</Label>
												<Textarea
													{...register(
														`analisis.${index}.observaciones`
													)}
													placeholder="Observaciones adicionales"
													rows={2}
												/>
											</div>
										</div>
									</Card>
								))
							)}
						</CardContent>
					</Card>

					{/* Botones de acción */}
					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={loading}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Creando..." : "Crear Consulta"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default DialogCreateConsulta;
