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
import { deleteCita } from "@/services/citasService";
import type { Cita } from "@/types";
import { Trash2 } from "lucide-react";

interface DialogDeleteCitaProps {
	cita: Cita;
}

const DialogDeleteCita = ({ cita }: DialogDeleteCitaProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		try {
			await deleteCita(cita.id_cita);
			toast.success("Cita eliminada exitosamente");
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al eliminar cita");
		} finally {
			setLoading(false);
		}
	};

	// Función para obtener el nombre completo del paciente
	const getPacienteName = () => {
		if (cita.usuario) {
			return `${cita.usuario.nombre} ${
				cita.usuario.apellido_paterno || ""
			} ${cita.usuario.apellido_materno || ""}`.trim();
		}
		return "Paciente desconocido";
	};

	// Función para obtener el nombre completo del médico
	const getMedicoName = () => {
		if (cita.medico?.usuario) {
			return `${cita.medico.usuario.nombre} ${
				cita.medico.usuario.apellido_paterno || ""
			} ${cita.medico.usuario.apellido_materno || ""}`.trim();
		}
		return "Médico desconocido";
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm">
					<Trash2 className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Eliminar Cita</DialogTitle>
					<DialogDescription>
						¿Estás seguro de que deseas eliminar esta cita? Esta
						acción no se puede deshacer.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="bg-muted p-4 rounded-lg">
						<h4 className="font-medium mb-2">
							Detalles de la cita:
						</h4>
						<p>
							<strong>Paciente:</strong> {getPacienteName()}
						</p>
						<p>
							<strong>Médico:</strong> {getMedicoName()}
						</p>
						<p>
							<strong>Fecha:</strong> {cita.fecha}
						</p>
						<p>
							<strong>Hora:</strong> {cita.hora_inicio} -{" "}
							{cita.hora_fin}
						</p>
						<p>
							<strong>Estado:</strong> {cita.estado}
						</p>
						{cita.motivo && (
							<p>
								<strong>Motivo:</strong> {cita.motivo}
							</p>
						)}
					</div>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={loading}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
						>
							{loading ? "Eliminando..." : "Eliminar"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DialogDeleteCita;
