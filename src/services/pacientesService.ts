"use server";

import type { Paciente } from "../types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

export async function getPacientes(): Promise<Paciente[]> {
	try {
		const res = await fetch(fullUrl("/api/pacientes"), {
			next: { tags: ["pacientes"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error fetch pacientes: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || "Error desconocido al obtener pacientes"
		);
	}
}

export async function getPaciente(id: number): Promise<Paciente> {
	try {
		const res = await fetch(fullUrl(`/api/pacientes/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch paciente ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener paciente ${id}`
		);
	}
}

export async function createPaciente(
	data: Partial<Paciente>
): Promise<Paciente> {
	try {
		const res = await fetch(fullUrl("/api/pacientes"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear paciente: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const created = await res.json();
		try {
			revalidateTag("pacientes");
		} catch (_) {}
		return created;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear paciente");
	}
}

export async function updatePaciente(
	id: number,
	data: Partial<Paciente>
): Promise<Paciente> {
	try {
		const res = await fetch(fullUrl(`/api/pacientes/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar paciente ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("pacientes");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar paciente ${id}`
		);
	}
}

export async function deletePaciente(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/pacientes/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar paciente ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("pacientes");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar paciente ${id}`
		);
	}
}
