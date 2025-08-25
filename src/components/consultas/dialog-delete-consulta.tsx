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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteConsulta } from "@/services/consultasService";
import type { Consulta } from "@/types";
import { Trash2, AlertTriangle, Stethoscope, TestTube } from "lucide-react";

interface DialogDeleteConsultaProps {
	consulta: Consulta;
	onConsultaDeleted: () => void;
}

const DialogDeleteConsulta = ({
	consulta,
	onConsultaDeleted,
}: DialogDeleteConsultaProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		try {
			await deleteConsulta(consulta.id_consulta);
			toast.success("Consulta eliminada exitosamente");
			setIsOpen(false);
			onConsultaDeleted();
		} catch (error: any) {
			toast.error(error.message || "Error al eliminar la consulta");
		} finally {
			setLoading(false);
		}
	};

	// Función para obtener el nombre completo del paciente
	const getPacienteName = () => {
		if (consulta.paciente?.usuario) {
			return `${consulta.paciente.usuario.nombre} ${
				consulta.paciente.usuario.apellido_paterno || ""
			} ${consulta.paciente.usuario.apellido_materno || ""}`.trim();
		}
		if (consulta.cita?.usuario) {
			return `${consulta.cita.usuario.nombre} ${
				consulta.cita.usuario.apellido_paterno || ""
			} ${consulta.cita.usuario.apellido_materno || ""}`.trim();
		}
		return "Paciente desconocido";
	};

	// Función para obtener el nombre completo del médico
	const getMedicoName = () => {
		if (consulta.medicoUser) {
			return `${consulta.medicoUser.nombre} ${
				consulta.medicoUser.apellido_paterno || ""
			} ${consulta.medicoUser.apellido_materno || ""}`.trim();
		}
		if (consulta.cita?.medico?.usuario) {
			return `${consulta.cita.medico.usuario.nombre} ${
				consulta.cita.medico.usuario.apellido_paterno || ""
			} ${consulta.cita.medico.usuario.apellido_materno || ""}`.trim();
		}
		return "Médico desconocido";
	};

	// Función para formatear fecha
	const formatDate = (dateString?: string | null) => {
		if (!dateString) return "No registrada";
		try {
			return new Date(dateString).toLocaleDateString("es-ES", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		} catch {
			return "Fecha inválida";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="text-red-600 hover:text-red-700"
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-red-600">
						<AlertTriangle className="w-5 h-5" />
						Confirmar Eliminación
					</DialogTitle>
					<DialogDescription>
						Esta acción no se puede deshacer. Se eliminará
						permanentemente la consulta y todos sus análisis
						asociados.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Información de la consulta */}
					<div className="bg-red-50 p-4 rounded-lg border border-red-200">
						<h4 className="font-medium mb-3 flex items-center gap-2">
							<Stethoscope className="w-4 h-4" />
							Detalles de la consulta a eliminar:
						</h4>
						<div className="space-y-2 text-sm">
							<p>
								<strong>ID:</strong> {consulta.id_consulta}
							</p>
							<p>
								<strong>Paciente:</strong> {getPacienteName()}
							</p>
							<p>
								<strong>Médico:</strong> {getMedicoName()}
							</p>
							<div>
								<strong>Cita ID:</strong>{" "}
								<Badge variant="outline">
									#{consulta.id_cita}
								</Badge>
							</div>
							<p>
								<strong>Fecha de registro:</strong>{" "}
								{formatDate(consulta.fecha_registro)}
							</p>
							{consulta.motivo && (
								<p>
									<strong>Motivo:</strong> {consulta.motivo}
								</p>
							)}
							{consulta.diagnostico && (
								<p>
									<strong>Diagnóstico:</strong>{" "}
									{consulta.diagnostico}
								</p>
							)}
							{consulta.proxima_cita && (
								<p>
									<strong>Próxima cita:</strong>{" "}
									{formatDate(consulta.proxima_cita)}
								</p>
							)}
						</div>
					</div>

					{/* Información de análisis */}
					{consulta.analisis && consulta.analisis.length > 0 && (
						<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
							<h4 className="font-medium mb-2 flex items-center gap-2 text-orange-800">
								<TestTube className="w-4 h-4" />
								Análisis asociados que se eliminarán:
							</h4>
							<div className="space-y-1">
								{consulta.analisis.map((analisis, index) => (
									<div
										key={analisis.id_analisis}
										className="text-sm text-orange-700"
									>
										• {analisis.tipo}{" "}
										{analisis.fecha &&
											`(${formatDate(analisis.fecha)})`}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Advertencia */}
					<div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
						<p className="text-sm text-yellow-800">
							<strong>⚠️ Advertencia:</strong> Esta acción
							eliminará permanentemente toda la información médica
							asociada a esta consulta.
						</p>
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
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
							className="bg-red-600 hover:bg-red-700"
						>
							{loading ? "Eliminando..." : "Eliminar Consulta"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DialogDeleteConsulta;
