"use server";

import type { Consulta } from "@/types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export async function getConsultas(): Promise<Consulta[]> {
	try {
		const res = await fetch(fullUrl("/api/consultas"), {
			next: { tags: ["consultas"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error obtener consultas: ${res.status} ${res.statusText}`
			);
		return await res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || "Error desconocido al obtener consultas"
		);
	}
}

export async function getConsulta(id: number): Promise<Consulta> {
	try {
		const res = await fetch(fullUrl(`/api/consultas/${id}`), {
			next: { tags: ["consultas"] },
		} as any);
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error obtener consulta ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		return await res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener consulta ${id}`
		);
	}
}

export async function createConsulta(data: any): Promise<Consulta> {
	try {
		const res = await fetch(fullUrl("/api/consultas"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear consulta: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const newConsulta = await res.json();
		try {
			revalidateTag("consultas");
		} catch (_) {}
		return newConsulta;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear consulta");
	}
}

export async function updateConsulta(id: number, data: any): Promise<Consulta> {
	try {
		const res = await fetch(fullUrl(`/api/consultas/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar consulta ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("consultas");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar consulta ${id}`
		);
	}
}

export async function deleteConsulta(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/consultas/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar consulta ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("consultas");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar consulta ${id}`
		);
	}
}

export async function getConsultasByCita(citaId: number): Promise<Consulta[]> {
	try {
		const res = await fetch(fullUrl(`/api/consultas/cita/${citaId}`), {
			next: { tags: ["consultas"] },
		} as any);
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error obtener consultas de cita ${citaId}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		return await res.json();
	} catch (err: any) {
		throw new Error(
			err?.message ||
				`Error desconocido al obtener consultas de cita ${citaId}`
		);
	}
}
