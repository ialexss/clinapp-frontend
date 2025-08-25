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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateCita } from "@/services/citasService";
import type { Cita } from "@/types";
import { RefreshCw } from "lucide-react";

interface DialogChangeEstadoCitaProps {
	cita: Cita;
}

const DialogChangeEstadoCita = ({ cita }: DialogChangeEstadoCitaProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedEstado, setSelectedEstado] = useState(
		cita.estado || "pendiente"
	);

	const estadosDisponibles = [
		{
			value: "pendiente",
			label: "Pendiente",
			color: "bg-yellow-100 text-yellow-800",
		},
		{
			value: "confirmada",
			label: "Confirmada",
			color: "bg-blue-100 text-blue-800",
		},
		{
			value: "en_curso",
			label: "En Curso",
			color: "bg-purple-100 text-purple-800",
		},
		{
			value: "completada",
			label: "Completada",
			color: "bg-green-100 text-green-800",
		},
		{
			value: "cancelada",
			label: "Cancelada",
			color: "bg-red-100 text-red-800",
		},
		{
			value: "no_asistio",
			label: "No Asistió",
			color: "bg-gray-100 text-gray-800",
		},
	];

	const handleChangeEstado = async () => {
		if (selectedEstado === cita.estado) {
			toast.info("El estado no ha cambiado");
			setIsOpen(false);
			return;
		}

		setLoading(true);
		try {
			await updateCita(cita.id_cita, {
				estado: selectedEstado,
			});
			toast.success(
				`Estado actualizado a: ${
					estadosDisponibles.find((e) => e.value === selectedEstado)
						?.label
				}`
			);
			setIsOpen(false);
		} catch (err) {
			toast.error("Error al actualizar el estado de la cita");
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

	const getCurrentEstadoInfo = () => {
		return estadosDisponibles.find(
			(e) => e.value === (cita.estado || "pendiente")
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="text-blue-600 hover:text-blue-700"
				>
					<RefreshCw className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Cambiar Estado de Cita</DialogTitle>
					<DialogDescription>
						Actualiza rápidamente el estado de la cita médica.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Información de la cita */}
					<div className="bg-gray-50 p-3 rounded-lg text-sm">
						<h4 className="font-medium mb-2">
							Detalles de la cita:
						</h4>
						<p>
							<strong>ID:</strong> {cita.id_cita}
						</p>
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
					</div>

					{/* Estado actual */}
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium">
							Estado actual:
						</span>
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${
								getCurrentEstadoInfo()?.color
							}`}
						>
							{getCurrentEstadoInfo()?.label}
						</span>
					</div>

					{/* Selector de nuevo estado */}
					<div className="space-y-2">
						<label className="text-sm font-medium">
							Nuevo estado:
						</label>
						<Select
							value={selectedEstado}
							onValueChange={setSelectedEstado}
						>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un estado" />
							</SelectTrigger>
							<SelectContent>
								{estadosDisponibles.map((estado) => (
									<SelectItem
										key={estado.value}
										value={estado.value}
									>
										<div className="flex items-center gap-2">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${estado.color}`}
											>
												{estado.label}
											</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Botones de acción */}
					<div className="flex justify-end gap-2 pt-4">
						<Button
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={loading}
						>
							Cancelar
						</Button>
						<Button onClick={handleChangeEstado} disabled={loading}>
							{loading ? "Actualizando..." : "Actualizar Estado"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DialogChangeEstadoCita;
