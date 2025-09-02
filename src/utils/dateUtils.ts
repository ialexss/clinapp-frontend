/**
 * Utilidades para manejo consistente de fechas
 * Evita problemas de zona horaria al interpretar fechas
 */

/**
 * Crea un objeto Date desde un string de fecha YYYY-MM-DD
 * sin problemas de zona horaria
 */
export function createDateFromString(dateString: string): Date {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day);
}

/**
 * Obtiene el nombre del día de la semana en español
 * desde un string de fecha YYYY-MM-DD
 */
export function getDayOfWeekFromDateString(dateString: string): string {
	const fecha = createDateFromString(dateString);
	return fecha.toLocaleDateString("es-ES", { weekday: "long" });
}

/**
 * Formatea una fecha string a formato dd/mm/yyyy
 */
export function formatDateString(dateString?: string | null): string {
	if (!dateString) return "No registrada";
	try {
		const fecha = createDateFromString(dateString);
		return fecha.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	} catch {
		return "Fecha inválida";
	}
}

/**
 * Compara si dos fechas string son el mismo día
 */
export function isSameDay(dateString1: string, dateString2: string): boolean {
	try {
		const date1 = createDateFromString(dateString1);
		const date2 = createDateFromString(dateString2);
		return date1.toDateString() === date2.toDateString();
	} catch {
		return false;
	}
}

/**
 * Verifica si una fecha string es hoy
 */
export function isToday(dateString: string): boolean {
	try {
		const fecha = createDateFromString(dateString);
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		return fecha.toDateString() === hoy.toDateString();
	} catch {
		return false;
	}
}

/**
 * Verifica si una fecha string es del mes actual
 */
export function isThisMonth(dateString: string): boolean {
	try {
		const fecha = createDateFromString(dateString);
		const ahora = new Date();
		return (
			fecha.getMonth() === ahora.getMonth() &&
			fecha.getFullYear() === ahora.getFullYear()
		);
	} catch {
		return false;
	}
}

/**
 * Verifica si una fecha está en el rango de los próximos N días
 */
export function isInNextDays(dateString: string, days: number = 7): boolean {
	try {
		const fechaCita = createDateFromString(dateString);
		const ahora = new Date();
		ahora.setHours(0, 0, 0, 0);
		const limite = new Date();
		limite.setDate(ahora.getDate() + days);

		return fechaCita >= ahora && fechaCita <= limite;
	} catch {
		return false;
	}
}
