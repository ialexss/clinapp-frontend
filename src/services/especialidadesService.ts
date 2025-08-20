"use server";

import type { Especialidad } from "../types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export async function getEspecialidades(): Promise<Especialidad[]> {
	try {
		const res = await fetch(fullUrl("/api/especialidades"), {
			next: { tags: ["especialidades"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error fetch especialidades: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || "Error desconocido al obtener especialidades"
		);
	}
}

export async function getEspecialidad(id: number): Promise<Especialidad> {
	try {
		const res = await fetch(fullUrl(`/api/especialidades/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch especialidad ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener especialidad ${id}`
		);
	}
}

export async function createEspecialidad(
	data: Partial<Especialidad>
): Promise<Especialidad> {
	try {
		const res = await fetch(fullUrl("/api/especialidades"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear especialidad: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const created = await res.json();
		try {
			revalidateTag("especialidades");
		} catch (_) {}
		return created;
	} catch (err: any) {
		throw new Error(
			err?.message || "Error desconocido al crear especialidad"
		);
	}
}

export async function updateEspecialidad(
	id: number,
	data: Partial<Especialidad>
): Promise<Especialidad> {
	try {
		const res = await fetch(fullUrl(`/api/especialidades/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar especialidad ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("especialidades");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar especialidad ${id}`
		);
	}
}

export async function deleteEspecialidad(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/especialidades/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar especialidad ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("especialidades");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar especialidad ${id}`
		);
	}
}
