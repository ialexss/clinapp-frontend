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
import { deleteUser } from "@/services/usersService";
import type { Usuario } from "@/types";

type Props = {
	user: Usuario;
	onDeleted?: () => void; // optional callback after deletion
};

const DialogDeleteUser = ({ user, onDeleted }: Props) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await deleteUser(user.id_usuario);
			toast.success("Usuario eliminado");
			setOpen(false);
			if (onDeleted) onDeleted();
		} catch (err) {
			toast.error("Error al eliminar el usuario");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive">Eliminar</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirmar eliminación</DialogTitle>
					<DialogDescription>
						¿Estás seguro que deseas eliminar al usuario{" "}
						<strong>{user.nombre}</strong>? Esta acción no se puede
						deshacer.
					</DialogDescription>
				</DialogHeader>

				<div className="flex justify-end gap-2 mt-4">
					<Button onClick={() => setOpen(false)} disabled={loading}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={loading}
					>
						{loading ? "Eliminando..." : "Eliminar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DialogDeleteUser;
