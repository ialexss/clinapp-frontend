import React from "react";
import { getUsers } from "@/services/usersService";
import { DynamicTable } from "@/components/dynamic-table";
import DialogCreateUser from "@/components/usuarios/dialog-create-user";
import DialogEditUser from "@/components/usuarios/dialog-edit-user";
import DialogDeleteUser from "@/components/usuarios/dialog-delete-user";

const pageUsuarios = async () => {
	const users = await getUsers();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
				<p className="text-muted-foreground">
					Administra los usuarios del sistema.
				</p>
			</div>
			<DialogCreateUser />
			<DynamicTable
				data={users}
				columns={[
					{ key: "id_usuario", label: "ID" },
					{ key: "nombre", label: "Nombre" },
					{ key: "email", label: "Email" },
					{ key: "id_rol", label: "Id Rol" },
					{
						key: "actions",
						label: "Acciones",
						visible: true,
						render: (row) => (
							<div className="flex gap-2">
								<DialogEditUser user={row} />
								<DialogDeleteUser user={row} />
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

export default pageUsuarios;
