"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DynamicFormBuilder, FormSchema } from "../dynamic-form";
import { getPacientesUsuarios } from "@/services/usersService";
import { getMedicos } from "@/services/medicosService";
import { createCita } from "@/services/citasService";
import { useHorariosMedico } from "@/hooks/useHorariosMedico";
import type { Medico, Usuario } from "@/types";

const DialogCreateCita = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<Usuario[]>([]);
	const [medicos, setMedicos] = useState<Medico[]>([]);
	const [selectedMedico, setSelectedMedico] = useState<number | null>(null);
	const [formData, setFormData] = useState<any>({});

	// Usar el hook personalizado para manejar horarios
	const {
		horarios,
		loading: horariosLoading,
		validateHorario,
	} = useHorariosMedico(selectedMedico);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersData, medicosData] = await Promise.all([
					getPacientesUsuarios(),
					getMedicos(),
				]);
				setUsers(usersData);
				setMedicos(medicosData);
			} catch (error) {
				toast.error("Error al cargar datos");
			}
		};
		fetchData();
	}, []);

	// Función para manejar cambios en el formulario
	const handleFormChange = (data: any) => {
		setFormData(data);
		// Detectar cambio en la selección del médico
		if (data.id_medico && parseInt(data.id_medico) !== selectedMedico) {
			setSelectedMedico(parseInt(data.id_medico));
		}
	};

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			// Usar la validación del hook personalizado
			if (
				selectedMedico &&
				data.fecha &&
				data.hora_inicio &&
				data.hora_fin
			) {
				const validation = validateHorario(
					data.fecha,
					data.hora_inicio,
					data.hora_fin
				);
				if (!validation.valid) {
					toast.error(validation.message);
					setLoading(false);
					return;
				}
			}

			await createCita({
				id_usuario: parseInt(data.id_usuario, 10),
				id_medico: parseInt(data.id_medico, 10),
				fecha: data.fecha,
				hora_inicio: data.hora_inicio,
				hora_fin: data.hora_fin,
				estado: data.estado || "pendiente",
				motivo: data.motivo,
				observaciones: data.observaciones,
				consultorio: data.consultorio,
			});
			toast.success("Cita creada exitosamente");
			setIsOpen(false);
			setSelectedMedico(null);
			setFormData({});
		} catch (err) {
			toast.error("Error al crear cita");
		} finally {
			setLoading(false);
		}
	};

	// Obtener el nombre del médico seleccionado
	const getMedicoName = () => {
		if (!selectedMedico) return null;
		const medico = medicos.find((m) => m.id_medico === selectedMedico);
		if (!medico?.usuario) return null;
		return `${medico.usuario.nombre} ${
			medico.usuario.apellido_paterno || ""
		} ${medico.usuario.apellido_materno || ""}`.trim();
	};

	const formSchema: FormSchema = {
		fields: [
			{
				name: "id_usuario",
				type: "select",
				label: "Paciente",
				required: true,
				options: users.map((user) => ({
					value: user.id_usuario.toString(),
					label: `${user.nombre} ${user.apellido_paterno || ""} ${
						user.apellido_materno || ""
					}`.trim(),
				})),
			},
			{
				name: "id_medico",
				type: "select",
				label: "Médico",
				required: true,
				options: medicos.map((medico) => ({
					value: medico.id_medico.toString(),
					label:
						`${medico.usuario?.nombre || ""} ${
							medico.usuario?.apellido_paterno || ""
						} ${medico.usuario?.apellido_materno || ""}`.trim() +
						(medico.especialidad
							? ` - ${medico.especialidad.nombre}`
							: ""),
				})),
			},
			{
				name: "fecha",
				type: "date",
				label: "Fecha",
				required: true,
			},
			{
				name: "hora_inicio",
				type: "time",
				label: "Hora de Inicio",
				required: true,
			},
			{
				name: "hora_fin",
				type: "time",
				label: "Hora de Fin",
				required: true,
			},
			{
				name: "estado",
				type: "select",
				label: "Estado",
				required: true,
				options: [
					{ value: "pendiente", label: "Pendiente" },
					{ value: "confirmada", label: "Confirmada" },
					{ value: "en_curso", label: "En Curso" },
					{ value: "completada", label: "Completada" },
					{ value: "cancelada", label: "Cancelada" },
					{ value: "no_asistio", label: "No Asistió" },
				],
			},
			{
				name: "motivo",
				type: "text",
				label: "Motivo",
				required: false,
			},
			{
				name: "observaciones",
				type: "text",
				label: "Observaciones",
				required: false,
			},
			{
				name: "consultorio",
				type: "select",
				label: "Consultorio",
				required: false,
				options: [
					{ value: "consultorio A1", label: "Consultorio A1" },
					{ value: "consultorio A2", label: "Consultorio A2" },
					{ value: "consultorio A3", label: "Consultorio A3" },
				],
			},
		],
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open) {
					setSelectedMedico(null);
					setFormData({});
				}
			}}
		>
			<DialogTrigger asChild>
				<Button>Crear Cita</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Crear Nueva Cita</DialogTitle>
					<DialogDescription>
						Completa los datos para agendar una nueva cita médica.
					</DialogDescription>
				</DialogHeader>

				{/* Selector independiente de médico para mostrar horarios */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Ver horarios del médico:
					</label>
					<select
						className="w-full p-2 border border-gray-300 rounded-md"
						value={selectedMedico || ""}
						onChange={(e) => {
							const value = e.target.value;
							setSelectedMedico(value ? parseInt(value) : null);
						}}
					>
						<option value="">
							Selecciona un médico para ver horarios
						</option>
						{medicos.map((medico) => (
							<option
								key={medico.id_medico}
								value={medico.id_medico}
							>
								{`${medico.usuario?.nombre || ""} ${
									medico.usuario?.apellido_paterno || ""
								} ${
									medico.usuario?.apellido_materno || ""
								}`.trim() +
									(medico.especialidad
										? ` - ${medico.especialidad.nombre}`
										: "")}
							</option>
						))}
					</select>
				</div>

				{/* Mostrar horarios del médico seleccionado */}
				{selectedMedico && (
					<div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm border border-blue-200">
						<div className="font-semibold text-blue-800 mb-2">
							📅 Horarios de {getMedicoName()}:
						</div>
						{horariosLoading ? (
							<p className="text-blue-600">
								Cargando horarios...
							</p>
						) : horarios.length > 0 ? (
							<div className="grid grid-cols-2 gap-2">
								{horarios.map((horario, index) => (
									<div
										key={index}
										className="bg-white p-2 rounded border border-blue-100"
									>
										<div className="font-medium text-blue-700 text-xs">
											{horario.dia_semana}
										</div>
										<div className="text-blue-600 text-xs">
											{horario.hora_inicio} -{" "}
											{horario.hora_fin}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-amber-600">
								No hay horarios disponibles para este médico.
							</p>
						)}
					</div>
				)}
				<DynamicFormBuilder
					schema={formSchema}
					onSubmit={handleSubmit}
					isLoading={loading}
					initialValues={{ estado: "pendiente" }}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default DialogCreateCita;
