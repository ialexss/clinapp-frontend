/**
 * Tipos de análisis de laboratorio predefinidos
 */

export interface TipoAnalisis {
	id: string;
	nombre: string;
	categoria: string;
	descripcion?: string;
}

export const TIPOS_ANALISIS: TipoAnalisis[] = [
	// ANÁLISIS DE SANGRE
	{
		id: "hemograma_completo",
		nombre: "Hemograma Completo",
		categoria: "Hematología",
		descripcion: "Conteo de células sanguíneas completo",
	},
	{
		id: "perfil_lipidico",
		nombre: "Perfil Lipídico",
		categoria: "Bioquímica",
		descripcion: "Colesterol total, HDL, LDL, triglicéridos",
	},
	{
		id: "glucosa_ayunas",
		nombre: "Glucosa en Ayunas",
		categoria: "Bioquímica",
		descripcion: "Medición de glucosa en sangre",
	},
	{
		id: "hemoglobina_glicosilada",
		nombre: "Hemoglobina Glicosilada (HbA1c)",
		categoria: "Bioquímica",
		descripcion: "Control de diabetes a largo plazo",
	},
	{
		id: "funcion_hepatica",
		nombre: "Función Hepática",
		categoria: "Bioquímica",
		descripcion: "TGO, TGP, bilirrubinas, albúmina",
	},
	{
		id: "funcion_renal",
		nombre: "Función Renal",
		categoria: "Bioquímica",
		descripcion: "Creatinina, urea, ácido úrico",
	},
	{
		id: "electrolitos",
		nombre: "Electrolitos",
		categoria: "Bioquímica",
		descripcion: "Sodio, potasio, cloro, CO2",
	},
	{
		id: "proteina_c_reactiva",
		nombre: "Proteína C Reactiva",
		categoria: "Inmunología",
		descripcion: "Marcador de inflamación",
	},
	{
		id: "velocidad_sedimentacion",
		nombre: "Velocidad de Sedimentación (VSG)",
		categoria: "Hematología",
		descripcion: "Indicador de inflamación",
	},
	{
		id: "tiroides_tsh",
		nombre: "TSH (Hormona Estimulante del Tiroides)",
		categoria: "Endocrinología",
		descripcion: "Función tiroidea",
	},
	{
		id: "tiroides_t3_t4",
		nombre: "T3 y T4 Libre",
		categoria: "Endocrinología",
		descripcion: "Hormonas tiroideas",
	},
	{
		id: "vitamina_d",
		nombre: "Vitamina D (25-OH)",
		categoria: "Bioquímica",
		descripcion: "Niveles de vitamina D",
	},
	{
		id: "vitamina_b12",
		nombre: "Vitamina B12",
		categoria: "Bioquímica",
		descripcion: "Niveles de vitamina B12",
	},
	{
		id: "acido_folico",
		nombre: "Ácido Fólico",
		categoria: "Bioquímica",
		descripcion: "Niveles de folato",
	},
	{
		id: "hierro_ferritina",
		nombre: "Hierro y Ferritina",
		categoria: "Hematología",
		descripcion: "Reservas de hierro",
	},

	// ANÁLISIS DE ORINA
	{
		id: "examen_general_orina",
		nombre: "Examen General de Orina",
		categoria: "Urología",
		descripcion: "Análisis físico, químico y microscópico",
	},
	{
		id: "urocultivo",
		nombre: "Urocultivo",
		categoria: "Microbiología",
		descripcion: "Cultivo para detectar infecciones urinarias",
	},
	{
		id: "microalbuminuria",
		nombre: "Microalbuminuria",
		categoria: "Urología",
		descripcion: "Detección temprana de daño renal",
	},

	// ANÁLISIS DE HECES
	{
		id: "coproparasitoscopico",
		nombre: "Coproparasitoscópico",
		categoria: "Microbiología",
		descripcion: "Detección de parásitos en heces",
	},
	{
		id: "coprocultivo",
		nombre: "Coprocultivo",
		categoria: "Microbiología",
		descripcion: "Cultivo de bacterias en heces",
	},
	{
		id: "sangre_oculta_heces",
		nombre: "Sangre Oculta en Heces",
		categoria: "Gastroenterología",
		descripcion: "Detección de sangrado gastrointestinal",
	},

	// MICROBIOLOGÍA
	{
		id: "cultivo_garganta",
		nombre: "Cultivo de Garganta",
		categoria: "Microbiología",
		descripcion: "Detección de infecciones en garganta",
	},
	{
		id: "cultivo_herida",
		nombre: "Cultivo de Herida",
		categoria: "Microbiología",
		descripcion: "Identificación de microorganismos en heridas",
	},
	{
		id: "cultivo_secrecion",
		nombre: "Cultivo de Secreción",
		categoria: "Microbiología",
		descripcion: "Análisis de secreciones corporales",
	},

	// SEROLOGÍA/INMUNOLOGÍA
	{
		id: "hepatitis_b_antigeno",
		nombre: "Antígeno de Superficie Hepatitis B",
		categoria: "Inmunología",
		descripcion: "Detección de hepatitis B",
	},
	{
		id: "hepatitis_c_anticuerpos",
		nombre: "Anticuerpos Hepatitis C",
		categoria: "Inmunología",
		descripcion: "Detección de hepatitis C",
	},
	{
		id: "vih_elisa",
		nombre: "VIH (ELISA)",
		categoria: "Inmunología",
		descripcion: "Detección de anticuerpos VIH",
	},
	{
		id: "vdrl",
		nombre: "VDRL",
		categoria: "Inmunología",
		descripcion: "Detección de sífilis",
	},
	{
		id: "torch",
		nombre: "TORCH",
		categoria: "Inmunología",
		descripcion: "Toxoplasma, Rubéola, CMV, Herpes",
	},

	// ANÁLISIS ESPECIALIZADOS
	{
		id: "marcadores_tumorales",
		nombre: "Marcadores Tumorales",
		categoria: "Oncología",
		descripcion: "PSA, CEA, CA 125, etc.",
	},
	{
		id: "gasometria_arterial",
		nombre: "Gasometría Arterial",
		categoria: "Neumología",
		descripcion: "Análisis de gases en sangre arterial",
	},
	{
		id: "tiempo_coagulacion",
		nombre: "Tiempo de Coagulación",
		categoria: "Hematología",
		descripcion: "TP, TTP, INR",
	},
	{
		id: "prueba_esfuerzo",
		nombre: "Prueba de Esfuerzo",
		categoria: "Cardiología",
		descripcion: "Evaluación cardiovascular",
	},
	{
		id: "holter_24h",
		nombre: "Holter 24 Horas",
		categoria: "Cardiología",
		descripcion: "Monitoreo cardíaco continuo",
	},
];

export const CATEGORIAS_ANALISIS = [
	"Hematología",
	"Bioquímica",
	"Inmunología",
	"Microbiología",
	"Urología",
	"Endocrinología",
	"Gastroenterología",
	"Neumología",
	"Cardiología",
	"Oncología",
];

/**
 * Obtiene tipos de análisis por categoría
 */
export function getTiposAnalisisPorCategoria(
	categoria: string
): TipoAnalisis[] {
	return TIPOS_ANALISIS.filter((tipo) => tipo.categoria === categoria);
}

/**
 * Busca tipos de análisis por nombre
 */
export function buscarTiposAnalisis(termino: string): TipoAnalisis[] {
	const terminoLower = termino.toLowerCase();
	return TIPOS_ANALISIS.filter(
		(tipo) =>
			tipo.nombre.toLowerCase().includes(terminoLower) ||
			tipo.descripcion?.toLowerCase().includes(terminoLower)
	);
}
