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
import { deleteMedico } from "@/services/medicosService";
import type { Medico } from "@/types";

type Props = {
	medico: Medico;
	onDeleted?: () => void;
};

const DialogDeleteMedico = ({ medico, onDeleted }: Props) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await deleteMedico(medico.id_medico);
			toast.success("Médico eliminado");
			setOpen(false);
			if (onDeleted) onDeleted();
		} catch (err) {
			toast.error("Error al eliminar el médico");
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
					<DialogTitle>Confirmar eliminar</DialogTitle>
					<DialogDescription>
						¿Estás seguro que deseas eliminar al médico{" "}
						<strong>{medico.id_medico}</strong>? Esta acción no se
						puede deshacer.
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
						{loading ? "Eliminando..." : "Confirmar eliminar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DialogDeleteMedico;
