"use client";
import { useState } from "react";

export default function ReporteCitasClient({ citas }: { citas: any[] }) {
	const [filtro, setFiltro] = useState("");

	// Filtrar citas por paciente, médico o estado
	const citasFiltradas = citas.filter((cita) => {
		const texto = filtro.toLowerCase();
		return (
			cita.paciente_usuario?.nombre?.toLowerCase().includes(texto) ||
			cita.medico?.usuario?.nombre?.toLowerCase().includes(texto) ||
			cita.paciente_usuario?.apellido_paterno
				?.toLowerCase()
				.includes(texto) ||
			cita.paciente_usuario?.apellido_materno
				?.toLowerCase()
				.includes(texto) ||
			cita.medico?.usuario?.apellido_paterno
				?.toLowerCase()
				.includes(texto) ||
			cita.medico?.usuario?.apellido_materno
				?.toLowerCase()
				.includes(texto) ||
			(cita.estado || "").toLowerCase().includes(texto)
		);
	});

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Reporte de Citas</h1>
			<div className="mb-4 print:hidden">
				<input
					type="text"
					placeholder="Filtrar por paciente, médico o estado..."
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
					className="border px-2 py-1 rounded w-full max-w-md"
				/>
			</div>
			<table className="w-full border border-gray-300 print:w-full print:border-none">
				<thead>
					<tr className="bg-gray-100">
						<th className="border px-2 py-1">ID</th>
						<th className="border px-2 py-1">Paciente</th>
						<th className="border px-2 py-1">Médico</th>
						<th className="border px-2 py-1">Fecha</th>
						<th className="border px-2 py-1">Horario</th>
						<th className="border px-2 py-1">Estado</th>
						<th className="border px-2 py-1">Motivo</th>
						<th className="border px-2 py-1">Consultorio</th>
					</tr>
				</thead>
				<tbody>
					{citasFiltradas.map((cita: any) => (
						<tr key={cita.id_cita}>
							<td className="border px-2 py-1">{cita.id_cita}</td>
							<td className="border px-2 py-1">
								{cita.paciente_usuario
									? `${cita.paciente_usuario.nombre} ${
											cita.paciente_usuario
												.apellido_paterno || ""
									  } ${
											cita.paciente_usuario
												.apellido_materno || ""
									  }`
									: "Sin paciente"}
							</td>
							<td className="border px-2 py-1">
								{cita.medico?.usuario
									? `${cita.medico.usuario.nombre} ${
											cita.medico.usuario
												.apellido_paterno || ""
									  } ${
											cita.medico.usuario
												.apellido_materno || ""
									  }`
									: "Sin médico"}
							</td>
							<td className="border px-2 py-1">
								{cita.fecha
									? new Date(cita.fecha).toLocaleDateString(
											"es-ES"
									  )
									: "No registrada"}
							</td>
							<td className="border px-2 py-1">
								{cita.hora_inicio && cita.hora_fin
									? `${cita.hora_inicio} - ${cita.hora_fin}`
									: "Sin horario"}
							</td>
							<td className="border px-2 py-1">
								{cita.estado || "pendiente"}
							</td>
							<td className="border px-2 py-1">
								{cita.motivo || "Sin motivo"}
							</td>
							<td className="border px-2 py-1">
								{cita.consultorio || "No asignado"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-8 print:hidden">
				<button
					className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg shadow"
					onClick={() => window.print()}
				>
					Imprimir
				</button>
			</div>
		</div>
	);
}
