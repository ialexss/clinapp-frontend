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
import { updateUser } from "@/services/usersService";
import type { Usuario } from "@/types";

type Props = {
	user: Usuario;
};

const DialogEditUser = ({ user }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([]);

	const handleSubmit = async (data: any) => {
		// Si se proporcionó confirm_password validarla opcionalmente
		if (data.confirm_password && data.password !== data.confirm_password) {
			toast.error("Las contraseñas no coinciden");
			return;
		}

		setLoading(true);
		try {
			await updateUser(user.id_usuario, {
				nombre: data.nombre,
				apellido_paterno: data.apellido_paterno,
				apellido_materno: data.apellido_materno,
				email: data.email,
				// En update, si el campo password viene vacío, omitimos actualizarla
				...(data.password ? { password: data.password } : {}),
				id_rol: parseInt(data.id_rol, 10),
			});
			toast.success("Usuario actualizado");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al actualizar el usuario");
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

	const initialValues = {
		nombre: user.nombre,
		apellido_paterno: user.apellido_paterno || "",
		apellido_materno: user.apellido_materno || "",
		email: user.email || "",
		id_rol: String(user.id_rol),
		// password intentionally left blank
	} as any;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Editar</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Usuario</DialogTitle>
					<DialogDescription>
						Actualizar datos del usuario.
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

export default DialogEditUser;
