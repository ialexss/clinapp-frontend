"use server";

import type { Rol } from "../types";
import { revalidateTag } from "next/cache";

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

/** Obtener todos los roles (usa tag 'roles' para revalidación) */
export async function getRoles(): Promise<Rol[]> {
	try {
		const res = await fetch(fullUrl("/api/roles"), {
			next: { tags: ["roles"] },
		} as any);
		if (!res.ok)
			throw new Error(
				`Error fetch roles: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al obtener roles");
	}
}

export async function getRole(id: number): Promise<Rol> {
	try {
		const res = await fetch(fullUrl(`/api/roles/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch role ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener role ${id}`
		);
	}
}

export async function createRole(data: Partial<Rol>): Promise<Rol> {
	try {
		const res = await fetch(fullUrl("/api/roles"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear role: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const created = await res.json();
		try {
			revalidateTag("roles");
		} catch (_) {}
		return created;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear role");
	}
}

export async function updateRole(id: number, data: Partial<Rol>): Promise<Rol> {
	try {
		const res = await fetch(fullUrl(`/api/roles/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar role ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		const updated = await res.json();
		try {
			revalidateTag("roles");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar role ${id}`
		);
	}
}

export async function deleteRole(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/roles/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar role ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		try {
			revalidateTag("roles");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar role ${id}`
		);
	}
}

// No export default in 'use server' files; functions are exported individually
