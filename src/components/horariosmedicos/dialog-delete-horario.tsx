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
import { deleteHorarioMedico } from "@/services/horariosmedicosService";
import type { HorarioMedico } from "@/types";

type Props = { horario: HorarioMedico; onDeleted?: () => void };

const DialogDeleteHorario = ({ horario, onDeleted }: Props) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await deleteHorarioMedico(horario.id_horario);
			toast.success("Horario eliminado");
			setOpen(false);
			if (onDeleted) onDeleted();
		} catch (err) {
			toast.error("Error al eliminar horario");
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
						¿Estás seguro que deseas eliminar el horario{" "}
						<strong>{horario.id_horario}</strong>? Esta acción no se
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

export default DialogDeleteHorario;
