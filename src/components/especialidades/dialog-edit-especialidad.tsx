"use client";
import { useState } from "react";
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
import { updateEspecialidad } from "@/services/especialidadesService";
import type { Especialidad } from "@/types";

type Props = {
	especialidad: Especialidad;
};

const DialogEditEspecialidad = ({ especialidad }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await updateEspecialidad(especialidad.id_especialidad, {
				nombre: data.nombre,
				descripcion: data.descripcion,
			});
			toast.success("Especialidad actualizada");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al actualizar especialidad");
		} finally {
			setLoading(false);
		}
	};

	const formSchema: FormSchema = {
		fields: [
			{ name: "nombre", label: "Nombre", type: "text", required: true },
			{
				name: "descripcion",
				label: "Descripción",
				type: "text",
				required: false,
			},
		],
	};

	const initialValues = {
		nombre: especialidad.nombre || "",
		descripcion: especialidad.descripcion || "",
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Editar</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Especialidad</DialogTitle>
					<DialogDescription>
						Actualizar datos de la especialidad.
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

export default DialogEditEspecialidad;
