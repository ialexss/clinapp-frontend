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
import { updateCita } from "@/services/citasService";
import { useHorariosMedico } from "@/hooks/useHorariosMedico";
import type { Cita, Medico, Usuario } from "@/types";
import { Pencil } from "lucide-react";

interface DialogEditCitaProps {
	cita: Cita;
}

const DialogEditCita = ({ cita }: DialogEditCitaProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<Usuario[]>([]);
	const [medicos, setMedicos] = useState<Medico[]>([]);
	const [selectedMedico, setSelectedMedico] = useState<number | null>(
		cita.id_medico || null
	);

	// Usar el hook personalizado para manejar horarios
	const { horarios, loading: horariosLoading } =
		useHorariosMedico(selectedMedico);

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

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await updateCita(cita.id_cita, {
				id_usuario: parseInt(data.id_usuario, 10),
				id_medico: parseInt(data.id_medico, 10),
				fecha: data.fecha,
				hora_inicio: data.hora_inicio,
				hora_fin: data.hora_fin,
				estado: data.estado,
				motivo: data.motivo,
				observaciones: data.observaciones,
				consultorio: data.consultorio,
			});
			toast.success("Cita actualizada exitosamente");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al actualizar cita");
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
				type: "text",
				label: "Consultorio",
				required: false,
			},
		],
	};

	// Valores iniciales basados en la cita actual
	const initialValues = {
		id_usuario: cita.id_usuario?.toString(),
		id_medico: cita.id_medico?.toString(),
		fecha: cita.fecha,
		hora_inicio: cita.hora_inicio,
		hora_fin: cita.hora_fin,
		estado: cita.estado || "pendiente",
		motivo: cita.motivo || "",
		observaciones: cita.observaciones || "",
		consultorio: cita.consultorio || "",
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Pencil className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Editar Cita</DialogTitle>
					<DialogDescription>
						Modifica los datos de la cita médica.
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
					initialValues={initialValues}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default DialogEditCita;
