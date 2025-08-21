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
import { deleteAnalisis } from "@/services/analisisService";
import type { AnalisisLaboratorio } from "@/types";

type Props = {
	analisis: AnalisisLaboratorio;
	onDeleted?: () => void;
};

const DialogDeleteAnalisis = ({ analisis, onDeleted }: Props) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await deleteAnalisis(analisis.id_analisis);
			toast.success("Análisis eliminado");
			setOpen(false);
			if (onDeleted) onDeleted();
		} catch (err) {
			toast.error("Error al eliminar análisis");
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
						¿Estás seguro que deseas eliminar el análisis{" "}
						<strong>{analisis.id_analisis}</strong>? Esta acción no
						se puede deshacer.
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

export default DialogDeleteAnalisis;
