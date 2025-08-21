import React from "react";
import { getMedicos } from "@/services/medicosService";
import { getHorariosMedicos } from "@/services/horariosmedicosService";
import DialogCreateHorario from "@/components/horariosmedicos/dialog-create-horario";
import DialogEditHorario from "@/components/horariosmedicos/dialog-edit-horario";
import DialogDeleteHorario from "@/components/horariosmedicos/dialog-delete-horario";

const dias = [
	"Lunes",
	"Martes",
	"Miércoles",
	"Jueves",
	"Viernes",
	"Sábado",
	"Domingo",
];

const pageHorariosMedicos = async () => {
	const medicos = await getMedicos();
	const horarios = await getHorariosMedicos();

	// Agrupar horarios por medico y por día
	const horariosPorMedico: Record<string, any> = {};
	medicos.forEach((m) => {
		horariosPorMedico[m.id_medico] = { medico: m, dias: {} };
		dias.forEach((d) => (horariosPorMedico[m.id_medico].dias[d] = []));
	});
	horarios.forEach((h: any) => {
		if (!horariosPorMedico[h.id_medico]) return;
		const dia = h.dia_semana || "Lunes";
		if (!horariosPorMedico[h.id_medico].dias[dia])
			horariosPorMedico[h.id_medico].dias[dia] = [];
		horariosPorMedico[h.id_medico].dias[dia].push(h);
	});

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					Horarios Médicos
				</h2>
				<p className="text-muted-foreground">
					Calendario semanal con horarios por médico.
				</p>
			</div>

			<DialogCreateHorario />

			<div className="overflow-x-auto">
				<table className="min-w-full border-collapse">
					<thead>
						<tr>
							<th className="border px-2 py-1">Médico</th>
							{dias.map((d) => (
								<th key={d} className="border px-2 py-1">
									{d}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{Object.values(horariosPorMedico).map((entry: any) => (
							<tr
								key={entry.medico.id_medico}
								className="align-top"
							>
								<td className="border px-2 py-1 align-top">
									{entry.medico.usuario?.nombre ||
										entry.medico.nombre}{" "}
									{entry.medico.usuario?.apellido_paterno ||
										""}
								</td>
								{dias.map((d) => (
									<td
										key={d}
										className="border px-2 py-1 align-top"
									>
										{entry.dias[d].length === 0 ? (
											<span className="text-sm text-muted-foreground">
												-
											</span>
										) : (
											entry.dias[d].map((h: any) => (
												<div
													key={h.id_horario}
													className="mb-2 rounded border p-2"
												>
													<div className="text-sm font-medium">
														{h.hora_inicio} -{" "}
														{h.hora_fin}
													</div>
													<div className="text-sm text-muted-foreground">
														{h.estado}
													</div>
													<div className="mt-2 flex gap-2">
														<DialogEditHorario
															horario={h}
														/>
														<DialogDeleteHorario
															horario={h}
														/>
													</div>
												</div>
											))
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default pageHorariosMedicos;
