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
import { Textarea } from "@/components/ui/textarea";
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
import { updateConsulta } from "@/services/consultasService";
import { getCitas } from "@/services/citasService";
import { getPacientesUsuarios } from "@/services/usersService";
import { getMedicos } from "@/services/medicosService";
import type {
	Consulta,
	Cita,
	Usuario,
	Medico,
	AnalisisLaboratorio,
} from "@/types";
import { Plus, Trash2, TestTube, Edit, Calendar } from "lucide-react";

interface DialogEditConsultaProps {
	consulta: Consulta;
	onConsultaUpdated: () => void;
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
	analisis: (AnalisisLaboratorio | Partial<AnalisisLaboratorio>)[];
}

const DialogEditConsulta = ({
	consulta,
	onConsultaUpdated,
}: DialogEditConsultaProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [citas, setCitas] = useState<Cita[]>([]);
	const [pacientes, setPacientes] = useState<Usuario[]>([]);
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
			loadConsultaData();
		}
	}, [isOpen]);

	useEffect(() => {
		if (selectedCitaId) {
			const cita = citas.find(
				(c) => c.id_cita === Number(selectedCitaId)
			);
			setSelectedCita(cita || null);
		}
	}, [selectedCitaId, citas]);

	const loadData = async () => {
		try {
			const [citasData, pacientesData, medicosData] = await Promise.all([
				getCitas(),
				getPacientesUsuarios(),
				getMedicos(),
			]);
			setCitas(citasData);
			setPacientes(pacientesData);
			setMedicos(medicosData);
		} catch (error) {
			toast.error("Error al cargar los datos");
			console.error(error);
		}
	};

	const loadConsultaData = () => {
		// Cargar datos de la consulta en el formulario
		setValue("id_cita", consulta.id_cita);
		setValue("id_usuario", consulta.id_usuario);
		setValue("id_paciente", consulta.id_paciente);
		setValue("motivo", consulta.motivo || "");
		setValue("diagnostico", consulta.diagnostico || "");
		setValue("tratamiento", consulta.tratamiento || "");
		setValue("indicaciones", consulta.indicaciones || "");
		setValue("proxima_cita", consulta.proxima_cita || "");

		// Cargar análisis existentes
		if (consulta.analisis) {
			setValue("analisis", consulta.analisis);
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

			await updateConsulta(consulta.id_consulta, consultaData);
			toast.success("Consulta actualizada exitosamente");
			setIsOpen(false);
			onConsultaUpdated();
		} catch (error: any) {
			toast.error(error.message || "Error al actualizar la consulta");
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
		return `#${cita.id_cita} - ${pacienteName} con ${medicoName} (${cita.fecha} ${cita.hora_inicio})`;
	};

	// Función para obtener el nombre del paciente de la consulta
	const getConsultaPacienteName = () => {
		if (consulta.paciente?.usuario) {
			return getPacienteName(consulta.paciente.usuario);
		}
		if (consulta.cita?.usuario) {
			return getPacienteName(consulta.cita.usuario);
		}
		return "Paciente desconocido";
	};

	// Función para obtener el nombre del médico de la consulta
	const getConsultaMedicoName = () => {
		if (consulta.medicoUser) {
			return `${consulta.medicoUser.nombre} ${
				consulta.medicoUser.apellido_paterno || ""
			} ${consulta.medicoUser.apellido_materno || ""}`.trim();
		}
		if (consulta.cita?.medico?.usuario) {
			return getMedicoName(consulta.cita.medico);
		}
		return "Médico desconocido";
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="text-blue-600 hover:text-blue-700"
				>
					<Edit className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Edit className="w-5 h-5" />
						Editar Consulta #{consulta.id_consulta}
					</DialogTitle>
					<DialogDescription>
						Paciente: {getConsultaPacienteName()} | Médico:{" "}
						{getConsultaMedicoName()}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Información básica */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="id_cita">Cita Médica *</Label>
							<Select
								value={watch("id_cita")?.toString()}
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
						</div>

						<div>
							<Label htmlFor="id_usuario">Médico *</Label>
							<Select
								value={watch("id_usuario")?.toString()}
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
						<div>
							<Label htmlFor="motivo">
								Motivo de la Consulta
							</Label>
							<Input
								{...register("motivo")}
								placeholder="Describe el motivo de la consulta"
							/>
						</div>

						<div>
							<Label htmlFor="diagnostico">Diagnóstico</Label>
							<Textarea
								{...register("diagnostico")}
								placeholder="Diagnóstico médico detallado"
								rows={3}
							/>
						</div>

						<div>
							<Label htmlFor="tratamiento">Tratamiento</Label>
							<Textarea
								{...register("tratamiento")}
								placeholder="Tratamiento recomendado"
								rows={3}
							/>
						</div>

						<div>
							<Label htmlFor="indicaciones">Indicaciones</Label>
							<Textarea
								{...register("indicaciones")}
								placeholder="Indicaciones adicionales para el paciente"
								rows={2}
							/>
						</div>

						<div>
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
											<div className="font-medium">
												Análisis #{index + 1}
												{(field as AnalisisLaboratorio)
													.id_analisis && (
													<Badge
														variant="outline"
														className="ml-2"
													>
														ID:{" "}
														{
															(
																field as AnalisisLaboratorio
															).id_analisis
														}
													</Badge>
												)}
											</div>
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
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label
													htmlFor={`analisis.${index}.tipo`}
												>
													Tipo de Análisis *
												</Label>
												<Input
													{...register(
														`analisis.${index}.tipo`,
														{ required: true }
													)}
													placeholder="Ej: Análisis de sangre, Orina, etc."
												/>
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
											<div className="md:col-span-2">
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
											<div className="md:col-span-2">
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
							{loading
								? "Actualizando..."
								: "Actualizar Consulta"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default DialogEditConsulta;
