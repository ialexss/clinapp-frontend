"use server";

import type { HorarioMedico } from "@/types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export async function getHorariosMedicos(): Promise<HorarioMedico[]> {
	try {
		const res = await fetch(fullUrl("/api/horariosmedicos"), {
			next: { tags: ["horariosmedicos"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error fetch horariosmedicos: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || "Error desconocido al obtener horariosmedicos"
		);
	}
}

export async function getHorarioMedico(id: number): Promise<HorarioMedico> {
	try {
		const res = await fetch(fullUrl(`/api/horariosmedicos/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch horario ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener horario ${id}`
		);
	}
}

export async function createHorarioMedico(
	data: Partial<HorarioMedico>
): Promise<HorarioMedico> {
	try {
		const res = await fetch(fullUrl("/api/horariosmedicos"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear horario: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const created = await res.json();
		try {
			revalidateTag("horariosmedicos");
		} catch (_) {}
		return created;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear horario");
	}
}

export async function updateHorarioMedico(
	id: number,
	data: Partial<HorarioMedico>
): Promise<HorarioMedico> {
	try {
		const res = await fetch(fullUrl(`/api/horariosmedicos/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar horario ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("horariosmedicos");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar horario ${id}`
		);
	}
}

export async function deleteHorarioMedico(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/horariosmedicos/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar horario ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("horariosmedicos");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar horario ${id}`
		);
	}
}
