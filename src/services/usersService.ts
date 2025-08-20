"use server";

import type { Usuario } from "../types";
import { revalidateTag } from "next/cache";

// Servicio de server-actions para CRUD de Usuarios contra el backend
// Usa como base de la URL la variable de entorno NEXT_PUBLIC_BACKEND_URL
const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

const jsonHeaders = { "Content-Type": "application/json" };

function fullUrl(path: string) {
	if (!BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL no está definida");
	return `${BASE}${path}`;
}

/** Obtener todos los usuarios
 *  Esta petición utiliza un tag 'usuarios' para que pueda revalidarse desde create/update
 */
export async function getUsers(): Promise<Usuario[]> {
	try {
		const res = await fetch(fullUrl("/api/usuarios"), {
			// usar caching con tags para permitir revalidación con revalidateTag
			next: { tags: ["usuarios"] },
		} as any);

		if (!res.ok)
			throw new Error(
				`Error fetch usuarios: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		// control centralizado de errores: relanzar con mensaje útil
		throw new Error(
			err?.message || "Error desconocido al obtener usuarios"
		);
	}
}

/** Obtener un usuario por id */
export async function getUser(id: number): Promise<Usuario> {
	try {
		const res = await fetch(fullUrl(`/api/usuarios/${id}`), {
			cache: "no-store",
		});
		if (!res.ok)
			throw new Error(
				`Error fetch usuario ${id}: ${res.status} ${res.statusText}`
			);
		return res.json();
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al obtener usuario ${id}`
		);
	}
}

/** Crear un usuario. `data` debe ser parcial del Usuario con los campos necesarios. */
export async function createUser(data: Partial<Usuario>): Promise<Usuario> {
	try {
		const res = await fetch(fullUrl("/api/usuarios"), {
			method: "POST",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error crear usuario: ${res.status} ${res.statusText} - ${body}`
			);
		}

		const created = await res.json();
		// revalidar la cache/tag para que getUsers sea actualizado
		try {
			revalidateTag("usuarios");
		} catch (_) {
			// no bloquear la respuesta si revalidate falla
		}
		return created;
	} catch (err: any) {
		throw new Error(err?.message || "Error desconocido al crear usuario");
	}
}

/** Actualizar un usuario por id (PUT). */
export async function updateUser(
	id: number,
	data: Partial<Usuario>
): Promise<Usuario> {
	try {
		const res = await fetch(fullUrl(`/api/usuarios/${id}`), {
			method: "PUT",
			headers: jsonHeaders,
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error actualizar usuario ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}

		const updated = await res.json();
		// revalidar la cache/tag para que getUsers sea actualizado
		try {
			revalidateTag("usuarios");
		} catch (_) {}
		return updated;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al actualizar usuario ${id}`
		);
	}
}

/** Eliminar un usuario por id */
export async function deleteUser(id: number): Promise<boolean> {
	try {
		const res = await fetch(fullUrl(`/api/usuarios/${id}`), {
			method: "DELETE",
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Error eliminar usuario ${id}: ${res.status} ${res.statusText} - ${body}`
			);
		}
		// revalidar la lista también al eliminar
		try {
			revalidateTag("usuarios");
		} catch (_) {}
		return true;
	} catch (err: any) {
		throw new Error(
			err?.message || `Error desconocido al eliminar usuario ${id}`
		);
	}
}
