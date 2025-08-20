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
import { getUsers } from "@/services/usersService";
import { getEspecialidades } from "@/services/especialidadesService";
import { createMedico } from "@/services/medicosService";

const DialogCreateMedico = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<
		{
			id_usuario: number;
			nombre: string;
			apellido_paterno?: string | null;
		}[]
	>([]);
	const [especialidades, setEspecialidades] = useState<
		{ id_especialidad: number; nombre: string }[]
	>([]);

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await createMedico({
				id_usuario: parseInt(data.id_usuario, 10),
				id_especialidad: parseInt(data.id_especialidad, 10),
				telefono: data.telefono,
				email: data.email,
			});
			toast.success("Médico creado exitosamente");
			setIsOpen(false);
		} catch (error) {
			toast.error("Error al crear el médico");
		} finally {
			setLoading(false);
		}
	};

	const formSchema: FormSchema = {
		fields: [
			{
				name: "id_usuario",
				label: "Usuario",
				type: "select",
				required: true,
				options: users.map((u) => ({
					label: `${u.nombre} ${u.apellido_paterno || ""}`.trim(),
					value: String(u.id_usuario),
				})),
			},
			{
				name: "id_especialidad",
				label: "Especialidad",
				type: "select",
				required: true,
				options: especialidades.map((e) => ({
					label: e.nombre,
					value: String(e.id_especialidad),
				})),
			},
			{
				name: "telefono",
				label: "Teléfono",
				type: "text",
				required: false,
			},
			{ name: "email", label: "Email", type: "email", required: false },
		],
	};

	useEffect(() => {
		const load = async () => {
			try {
				const u = await getUsers();
				setUsers(u);
			} catch {
				setUsers([]);
			}
			try {
				const es = await getEspecialidades();
				setEspecialidades(es);
			} catch {
				setEspecialidades([]);
			}
		};
		if (isOpen) load();
	}, [isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Crear médico</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nuevo Médico</DialogTitle>
					<DialogDescription>
						Agrega un nuevo médico al sistema.
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

export default DialogCreateMedico;
