"use server";

import type { AnalisisLaboratorio } from "@/types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export async function getAnalisis(): Promise<AnalisisLaboratorio[]> {
	try {
		const res = await fetch(fullUrl("/api/analisislaboratorio"), {
			next: { tags: ["analisislaboratorio"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error fetch analisis: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || "Error desconocido al obtener análisis"
		);
	}
}

export async function getAnalisisById(
	id: number
): Promise<AnalisisLaboratorio> {
	try {
		const res = await fetch(fullUrl(`/api/analisislaboratorio/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch analisis ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener análisis ${id}`
		);
	}
}

export async function createAnalisis(
	data: Partial<AnalisisLaboratorio>
): Promise<AnalisisLaboratorio> {
	try {
		const res = await fetch(fullUrl("/api/analisislaboratorio"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear análisis: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const created = await res.json();
		try {
			revalidateTag("analisislaboratorio");
		} catch (_) {}
		return created;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear análisis");
	}
}

export async function updateAnalisis(
	id: number,
	data: Partial<AnalisisLaboratorio>
): Promise<AnalisisLaboratorio> {
	try {
		const res = await fetch(fullUrl(`/api/analisislaboratorio/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar análisis ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("analisislaboratorio");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar análisis ${id}`
		);
	}
}

export async function deleteAnalisis(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/analisislaboratorio/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar análisis ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("analisislaboratorio");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar análisis ${id}`
		);
	}
}
