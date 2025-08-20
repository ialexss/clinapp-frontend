// Tipos TypeScript que reflejan los models PHP del backend.
// He mantenido los nombres de campos en snake_case para coincidir con la API del backend.
// Nota: algunos models relacionados (Consulta, Cita, AnalisisLaboratorio, HorarioMedico)
// no tenían su definición incluida en los attachments, así que definí formas mínimas
// razonables para uso en el front. Si prefieres campos diferentes, los actualizo.

export interface Rol {
	id: number;
	nombre: string;
	// timestamps true en el model, puede incluir created_at/updated_at en algunas respuestas
	created_at?: string | null;
	updated_at?: string | null;
	// relación
	usuarios?: Usuario[];
}

export interface Especialidad {
	id_especialidad: number;
	nombre: string;
	descripcion?: string | null;
	// relaciones
	medicos?: Medico[];
}

export interface Usuario {
	id_usuario: number;
	id_rol: number;
	nombre: string;
	apellido_paterno?: string | null;
	apellido_materno?: string | null;
	email?: string | null;
	password?: string | null;
	estado?: number | null;
	// relaciones opcionales que el backend puede incluir en respuestas con eager loading
	rol?: Rol;
	paciente?: Paciente;
	medico?: Medico;
}

export interface Paciente {
	id_paciente: number;
	id_usuario: number;
	ci?: string | null;
	fecha_nac?: string | null; // ISO date string
	sexo?: string | null;
	telefono?: string | null;
	email?: string | null;
	direccion?: string | null;
	created_at?: string | null;
	// relaciones
	usuario?: Usuario;
	consultas?: Consulta[];
	citas?: Cita[];
}

export interface Medico {
	id_medico: number;
	id_usuario: number;
	id_especialidad?: number | null;
	telefono?: string | null;
	email?: string | null;
	// timestamps true en el model
	created_at?: string | null;
	updated_at?: string | null;
	// relaciones
	usuario?: Usuario;
	especialidad?: Especialidad;
}

// Tipos mínimos (suposiciones razonables) para entidades relacionadas no incluidas
// en los attachments. Ajusta según el backend real si hace falta.
export interface Consulta {
	id_consulta: number;
	id_cita?: number | null;
	id_usuario?: number | null;
	id_paciente?: number | null;
	motivo?: string | null;
	diagnostico?: string | null;
	tratamiento?: string | null;
	indicaciones?: string | null;
	proxima_cita?: string | null;
	fecha_registro?: string | null;
	// relaciones
	cita?: Cita;
	usuario?: Usuario;
	paciente?: Paciente;
	analisis?: AnalisisLaboratorio[];
}

export interface Cita {
	id_cita: number;
	id_usuario: number; // quien pidió la cita (paciente/usuario)
	id_medico?: number | null;
	fecha?: string | null;
	hora_inicio?: string | null;
	hora_fin?: string | null;
	estado?: string | null;
	motivo?: string | null;
	observaciones?: string | null;
	consultorio?: string | null;
	created_at?: string | null;
	// relaciones
	usuario?: Usuario;
	medico?: Medico;
	consulta?: Consulta;
}

export interface AnalisisLaboratorio {
	id_analisis: number;
	id_consulta: number;
	tipo?: string | null;
	resultado?: string | null;
	observaciones?: string | null;
	fecha?: string | null;
	// relacion
	consulta?: Consulta;
}

export interface HorarioMedico {
	id_horario: number;
	id_medico: number;
	dia_semana?: string | null; // e.g., 'Lunes'
	hora_inicio?: string | null; // e.g., '08:00'
	hora_fin?: string | null; // e.g., '12:00'
	estado?: string | null;
	// relacion
	medico?: Medico;
}

// Exportar todo desde un único lugar ayuda las importaciones en el front
export type BackendModels =
	| Usuario
	| Paciente
	| Medico
	| Especialidad
	| Rol
	| Consulta
	| Cita
	| AnalisisLaboratorio
	| HorarioMedico;
