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
import { getMedicos } from "@/services/medicosService";
import { updateHorarioMedico } from "@/services/horariosmedicosService";
import type { HorarioMedico } from "@/types";

type Props = { horario: HorarioMedico };

const DialogEditHorario = ({ horario }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [medicos, setMedicos] = useState<any[]>([]);

	useEffect(() => {
		const load = async () => {
			try {
				const m = await getMedicos();
				setMedicos(m);
			} catch {
				setMedicos([]);
			}
		};
		if (isOpen) load();
	}, [isOpen]);

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await updateHorarioMedico(horario.id_horario, {
				id_medico: parseInt(data.id_medico, 10),
				dia_semana: data.dia_semana,
				hora_inicio: data.hora_inicio,
				hora_fin: data.hora_fin,
				estado: data.estado,
			});
			toast.success("Horario actualizado");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al actualizar horario");
		} finally {
			setLoading(false);
		}
	};

	const formSchema: FormSchema = {
		fields: [
			{
				name: "id_medico",
				label: "Médico",
				type: "select",
				required: true,
				options: medicos.map((m) => ({
					label: `${m.usuario?.nombre || m.nombre} ${
						m.usuario?.apellido_paterno || ""
					}`.trim(),
					value: String(m.id_medico),
				})),
			},
			{
				name: "dia_semana",
				label: "Día",
				type: "select",
				required: true,
				options: [
					"Lunes",
					"Martes",
					"Miércoles",
					"Jueves",
					"Viernes",
					"Sábado",
					"Domingo",
				],
			},
			{
				name: "hora_inicio",
				label: "Hora inicio",
				type: "time",
				required: true,
			},
			{
				name: "hora_fin",
				label: "Hora fin",
				type: "time",
				required: true,
			},
			{
				name: "estado",
				label: "Estado",
				type: "select",
				required: false,
				options: ["activo", "inactivo"],
			},
		],
	};

	const initialValues = {
		id_medico: horario.id_medico ? String(horario.id_medico) : "",
		dia_semana: horario.dia_semana || "",
		hora_inicio: horario.hora_inicio || "",
		hora_fin: horario.hora_fin || "",
		estado: horario.estado || "",
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Editar</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Horario</DialogTitle>
					<DialogDescription>
						Actualizar horario del médico.
					</DialogDescription>
				</DialogHeader>
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

export default DialogEditHorario;
