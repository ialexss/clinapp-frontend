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
import { updateAnalisis } from "@/services/analisisService";
import type { AnalisisLaboratorio } from "@/types";

type Props = {
	analisis: AnalisisLaboratorio;
};

const DialogEditAnalisis = ({ analisis }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await updateAnalisis(analisis.id_analisis, {
				id_consulta: data.id_consulta
					? parseInt(data.id_consulta, 10)
					: undefined,
				tipo: data.tipo,
				resultado: data.resultado,
				observaciones: data.observaciones,
				fecha: data.fecha,
			});
			toast.success("Análisis actualizado");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al actualizar análisis");
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

	const initialValues = {
		id_consulta: analisis.id_consulta ? String(analisis.id_consulta) : "",
		tipo: analisis.tipo || "",
		resultado: analisis.resultado || "",
		observaciones: analisis.observaciones || "",
		fecha: analisis.fecha || "",
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Editar</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Análisis</DialogTitle>
					<DialogDescription>
						Actualizar análisis de laboratorio.
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

export default DialogEditAnalisis;
