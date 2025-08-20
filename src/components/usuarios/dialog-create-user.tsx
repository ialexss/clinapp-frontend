"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DynamicFormBuilder } from "../dynamic-form";
import { FormSchema } from "../dynamic-form";
import { getRoles } from "@/services/rolesService";
import { createUser } from "@/services/usersService";

const DialogCreateUser = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([]);

	const handleSubmit = async (data: any) => {
		// Validar que contraseña y confirmación coincidan
		if (data.password !== data.confirm_password) {
			toast.error("Las contraseñas no coinciden");
			return;
		}

		setLoading(true);
		try {
			// Lógica para crear el usuario
			await createUser({
				nombre: data.nombre,
				apellido_paterno: data.apellido_paterno,
				apellido_materno: data.apellido_materno,
				email: data.email,
				password: data.password,
				id_rol: parseInt(data.id_rol, 10),
			});
			toast.success("Usuario creado exitosamente");
			setIsOpen(false);
		} catch (error) {
			toast.error("Error al crear el usuario");
		} finally {
			setLoading(false);
		}
	};

	const formSchema: FormSchema = {
		fields: [
			{
				name: "nombre",
				label: "Nombre",
				type: "text",
				required: true,
			},
			{
				name: "apellido_paterno",
				label: "Apellido Paterno",
				type: "text",
				required: true,
			},
			{
				name: "apellido_materno",
				label: "Apellido Materno",
				type: "text",
				required: true,
			},
			{
				name: "email",
				label: "Email",
				type: "email",
				required: true,
			},
			{
				name: "password",
				label: "Contraseña",
				type: "password",
				required: true,
			},
			{
				name: "confirm_password",
				label: "Confirmar Contraseña",
				type: "password",
				required: true,
			},
			{
				name: "id_rol",
				label: "Rol",
				type: "select",
				options: roles.map((role) => ({
					label: role.nombre,
					value: String(role.id),
				})),
			},
		],
	};

	useEffect(() => {
		const loadRoles = async () => {
			try {
				const r = await getRoles();
				setRoles(r);
			} catch {
				setRoles([]);
			}
		};
		if (isOpen) loadRoles();
	}, [isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer">Crear usuario</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nuevo Usuario</DialogTitle>
					<DialogDescription>
						Agrega un nuevo usuario al sistema.
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

export default DialogCreateUser;
