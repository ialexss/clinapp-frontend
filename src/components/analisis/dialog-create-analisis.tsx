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
import { createAnalisis } from "@/services/analisisService";

const DialogCreateAnalisis = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await createAnalisis({
				id_consulta: data.id_consulta
					? parseInt(data.id_consulta, 10)
					: undefined,
				tipo: data.tipo,
				resultado: data.resultado,
				observaciones: data.observaciones,
				fecha: data.fecha,
			});
			toast.success("Análisis creado");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al crear análisis");
		} finally {
			setLoading(false);
		}
	};

	const formSchema: FormSchema = {
		fields: [
			{
				name: "id_consulta",
				label: "ID Consulta",
				type: "number",
				required: false,
			},
			{ name: "tipo", label: "Tipo", type: "text", required: true },
			{
				name: "resultado",
				label: "Resultado",
				type: "text",
				required: false,
			},
			{
				name: "observaciones",
				label: "Observaciones",
				type: "text",
				required: false,
			},
			{ name: "fecha", label: "Fecha", type: "date", required: false },
		],
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Registrar análisis</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nuevo Análisis</DialogTitle>
					<DialogDescription>
						Agregar análisis de laboratorio.
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

export default DialogCreateAnalisis;
