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
import { createEspecialidad } from "@/services/especialidadesService";

const DialogCreateEspecialidad = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await createEspecialidad({
				nombre: data.nombre,
				descripcion: data.descripcion,
			});
			toast.success("Especialidad creada");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al crear especialidad");
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

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Crear especialidad</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nueva Especialidad</DialogTitle>
					<DialogDescription>
						Agrega una nueva especialidad.
					</DialogDescription>
				</DialogHeader>
				<DynamicFormBuilder
					schema={formSchema}
					onSubmit={handleSubmit}
					isLoading={loading}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default DialogCreateEspecialidad;
