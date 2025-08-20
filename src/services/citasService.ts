"use server";

import type { Cita } from "../types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export async function getCitas(): Promise<Cita[]> {
	try {
		const res = await fetch(fullUrl("/api/citas"), {
			next: { tags: ["citas"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error fetch citas: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al obtener citas");
	}
}

export async function getCita(id: number): Promise<Cita> {
	try {
		const res = await fetch(fullUrl(`/api/citas/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch cita ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener cita ${id}`
		);
	}
}

export async function createCita(data: Partial<Cita>): Promise<Cita> {
	try {
		const res = await fetch(fullUrl("/api/citas"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear cita: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const created = await res.json();
		try {
			revalidateTag("citas");
		} catch (_) {}
		return created;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear cita");
	}
}

export async function updateCita(
	id: number,
	data: Partial<Cita>
): Promise<Cita> {
	try {
		const res = await fetch(fullUrl(`/api/citas/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar cita ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("citas");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar cita ${id}`
		);
	}
}

export async function deleteCita(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/citas/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar cita ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("citas");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar cita ${id}`
		);
	}
}
