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
import { getRoles } from "@/services/rolesService";
import { getUsers } from "@/services/usersService";
import { getEspecialidades } from "@/services/especialidadesService";
import { updateMedico } from "@/services/medicosService";
import type { Medico } from "@/types";

type Props = {
	medico: Medico;
};

const DialogEditMedico = ({ medico }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([]);
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
			await updateMedico(medico.id_medico, {
				id_usuario: parseInt(data.id_usuario, 10),
				id_especialidad: parseInt(data.id_especialidad, 10),
				telefono: data.telefono,
				email: data.email,
			});
			toast.success("Médico actualizado");
			setIsOpen(false);
		} catch (error) {
			toast.error("Error al actualizar el médico");
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
				const r = await getRoles();
				setRoles(r);
			} catch {
				setRoles([]);
			}
			try {
				const u = await getUsers();
				setUsers(u);
			} catch {
				setUsers([]);
			}
			try {
				const e = await getEspecialidades();
				setEspecialidades(e);
			} catch {
				setEspecialidades([]);
			}
		};
		if (isOpen) load();
	}, [isOpen]);

	const initialValues = {
		id_usuario: String(medico.id_usuario),
		id_especialidad: medico.id_especialidad
			? String(medico.id_especialidad)
			: "",
		telefono: medico.telefono || "",
		email: medico.email || "",
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Editar</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Médico</DialogTitle>
					<DialogDescription>
						Actualizar datos del médico.
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

export default DialogEditMedico;
