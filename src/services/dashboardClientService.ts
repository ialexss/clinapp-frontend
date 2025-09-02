"use client";

// Servicio para obtener estadísticas del dashboard desde el cliente
const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export interface DashboardStats {
	totalUsuarios: number;
	totalCitas: number;
	citasHoy: number;
	citasPendientes: number;
	totalConsultas: number;
	totalMedicos: number;
	totalEspecialidades: number;
	consultasHoy: number;
	citasConfirmadas: number;
	citasCanceladas: number;
	citasCompletadas: number;
	pacientesActivos: number;
}

export interface SystemStatus {
	api: "active" | "inactive";
	database: "connected" | "disconnected";
	services: "operational" | "maintenance";
}

/**
 * Obtener estadísticas del dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
	try {
		const response = await fetch(fullUrl("/api/dashboard/stats"), {
			method: "GET",
			headers: jsonHeaders,
			cache: "no-store", // No usar cache para datos en tiempo real
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		// Retornar datos por defecto en caso de error
		return {
			totalUsuarios: 0,
			totalCitas: 0,
			citasHoy: 0,
			citasPendientes: 0,
			totalConsultas: 0,
			totalMedicos: 0,
			totalEspecialidades: 0,
			consultasHoy: 0,
			citasConfirmadas: 0,
			citasCanceladas: 0,
			citasCompletadas: 0,
			pacientesActivos: 0,
		};
	}
}

/**
 * Obtener estado del sistema
 */
export async function getSystemStatus(): Promise<SystemStatus> {
	try {
		const response = await fetch(fullUrl("/api/dashboard/system-status"), {
			method: "GET",
			headers: jsonHeaders,
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	} catch (error) {
		console.error("Error fetching system status:", error);
		// Retornar estado por defecto en caso de error
		return {
			api: "active",
			database: "connected",
			services: "operational",
		};
	}
}

/**
 * Obtener estadísticas de citas por estado
 */
export async function getCitasEstadisticas(): Promise<{
	confirmadas: number;
	pendientes: number;
	canceladas: number;
	completadas: number;
}> {
	try {
		const response = await fetch(fullUrl("/api/dashboard/citas-stats"), {
			method: "GET",
			headers: jsonHeaders,
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	} catch (error) {
		console.error("Error fetching citas statistics:", error);
		return {
			confirmadas: 0,
			pendientes: 0,
			canceladas: 0,
			completadas: 0,
		};
	}
}

/**
 * Obtener estadísticas de consultas por período
 */
export async function getConsultasEstadisticas(): Promise<{
	hoy: number;
	esteMes: number;
	esteAnio: number;
	total: number;
}> {
	try {
		const response = await fetch(
			fullUrl("/api/dashboard/consultas-stats"),
			{
				method: "GET",
				headers: jsonHeaders,
				cache: "no-store",
			}
		);

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	} catch (error) {
		console.error("Error fetching consultas statistics:", error);
		return {
			hoy: 0,
			esteMes: 0,
			esteAnio: 0,
			total: 0,
		};
	}
}
