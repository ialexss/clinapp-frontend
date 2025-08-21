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
import { getRoles } from "@/services/rolesService";
import { createPaciente } from "@/services/pacientesService";

const DialogCreatePaciente = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<
		{
			id_usuario: number;
			nombre: string;
			apellido_paterno?: string | null;
		}[]
	>([]);

	const handleSubmit = async (data: any) => {
		setLoading(true);
		try {
			await createPaciente({
				id_usuario: parseInt(data.id_usuario, 10),
				ci: data.ci,
				fecha_nac: data.fecha_nac,
				sexo: data.sexo,
				telefono: data.telefono,
				email: data.email,
				direccion: data.direccion,
			});
			toast.success("Paciente creado");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al crear paciente");
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
			{ name: "ci", label: "CI", type: "text", required: false },
			{
				name: "fecha_nac",
				label: "Fecha de nacimiento",
				type: "date",
				required: false,
			},
			{
				name: "sexo",
				label: "Sexo",
				type: "select",
				required: false,
				options: ["Masculino", "Femenino", "Otro"],
			},
			{
				name: "telefono",
				label: "Teléfono",
				type: "text",
				required: false,
			},
			{ name: "email", label: "Email", type: "email", required: false },
			{
				name: "direccion",
				label: "Dirección",
				type: "text",
				required: false,
			},
		],
	};

	useEffect(() => {
		const load = async () => {
			try {
				const roles = await getRoles();
				const pacienteRole = roles.find(
					(r) => r.nombre && r.nombre.toLowerCase() === "paciente"
				);
				const u = await getUsers();
				if (pacienteRole) {
					setUsers(
						u.filter((x: any) => x.id_rol === pacienteRole.id)
					);
				} else {
					// si no existe el role 'Paciente', fallback: todos
					setUsers(u);
				}
			} catch {
				setUsers([]);
			}
		};
		if (isOpen) load();
	}, [isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Crear paciente</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nuevo Paciente</DialogTitle>
					<DialogDescription>
						Añade un paciente al sistema.
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

export default DialogCreatePaciente;
