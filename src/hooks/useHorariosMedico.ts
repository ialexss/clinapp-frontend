import { useState, useEffect } from "react";
import { getHorariosByMedico } from "@/services/horariosmedicosService";
import type { HorarioMedico } from "@/types";
import { toast } from "sonner";
import { getDayOfWeekFromDateString } from "@/utils/dateUtils";

export const useHorariosMedico = (medicoId: number | null) => {
	const [horarios, setHorarios] = useState<HorarioMedico[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loadHorarios = async () => {
			if (medicoId) {
				setLoading(true);
				try {
					const horariosData = await getHorariosByMedico(medicoId);
					setHorarios(
						horariosData.filter((h) => h.estado === "activo")
					);
				} catch (error) {
					toast.error("Error al cargar horarios del médico");
					setHorarios([]);
				} finally {
					setLoading(false);
				}
			} else {
				setHorarios([]);
			}
		};
		loadHorarios();
	}, [medicoId]);

	const validateHorario = (
		fecha: string,
		horaInicio: string,
		horaFin: string
	): { valid: boolean; message?: string } => {
		if (!fecha || !horaInicio || !horaFin) {
			return { valid: false, message: "Fecha y horas son requeridas" };
		}

		// Usar la utilidad para obtener el día de la semana correctamente
		const diaSemana = getDayOfWeekFromDateString(fecha);
		const diaCapitalizado =
			diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

		const horarioDelDia = horarios.find(
			(h) => h.dia_semana?.toLowerCase() === diaSemana.toLowerCase()
		);

		if (
			!horarioDelDia ||
			!horarioDelDia.hora_inicio ||
			!horarioDelDia.hora_fin
		) {
			return {
				valid: false,
				message: `El médico no tiene horario disponible para ${diaCapitalizado}`,
			};
		}

		if (
			horaInicio < horarioDelDia.hora_inicio ||
			horaFin > horarioDelDia.hora_fin
		) {
			return {
				valid: false,
				message: `El horario debe estar entre ${horarioDelDia.hora_inicio} y ${horarioDelDia.hora_fin}`,
			};
		}

		if (horaInicio >= horaFin) {
			return {
				valid: false,
				message: "La hora de inicio debe ser anterior a la hora de fin",
			};
		}

		return { valid: true };
	};

	const getHorarioForDay = (dayName: string): HorarioMedico | undefined => {
		return horarios.find(
			(h) => h.dia_semana?.toLowerCase() === dayName.toLowerCase()
		);
	};

	return {
		horarios,
		loading,
		validateHorario,
		getHorarioForDay,
		hasHorarios: horarios.length > 0,
	};
};
