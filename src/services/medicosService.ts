"use server";

import type { Medico } from "../types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export async function getMedicos(): Promise<Medico[]> {
	try {
		const res = await fetch(fullUrl("/api/medicos"), {
			next: { tags: ["medicos"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error fetch medicos: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al obtener medicos");
	}
}

export async function getMedico(id: number): Promise<Medico> {
	try {
		const res = await fetch(fullUrl(`/api/medicos/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch medico ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener medico ${id}`
		);
	}
}

export async function createMedico(data: Partial<Medico>): Promise<Medico> {
	try {
		const res = await fetch(fullUrl("/api/medicos"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear medico: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const created = await res.json();
		try {
			revalidateTag("medicos");
		} catch (_) {}
		return created;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear medico");
	}
}

export async function updateMedico(
	id: number,
	data: Partial<Medico>
): Promise<Medico> {
	try {
		const res = await fetch(fullUrl(`/api/medicos/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar medico ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("medicos");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar medico ${id}`
		);
	}
}

export async function deleteMedico(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/medicos/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar medico ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("medicos");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar medico ${id}`
		);
	}
}
