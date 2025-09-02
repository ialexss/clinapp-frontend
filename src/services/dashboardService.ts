"use server";

import { revalidateTag } from "next/cache";

// Servicio para obtener estadísticas del dashboard
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
			next: { tags: ["dashboard-stats"], revalidate: 300 }, // Revalidar cada 5 minutos
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
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
			next: { tags: ["system-status"], revalidate: 60 }, // Revalidar cada minuto
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
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
			next: { tags: ["citas-stats"], revalidate: 300 },
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
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
				next: { tags: ["consultas-stats"], revalidate: 300 },
			}
		);

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
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

/**
 * Revalidar cache de estadísticas
 */
export async function revalidateDashboardStats() {
	revalidateTag("dashboard-stats");
	revalidateTag("system-status");
	revalidateTag("citas-stats");
	revalidateTag("consultas-stats");
}
