"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Users,
	Calendar,
	FileText,
	Stethoscope,
	Building,
	Clock,
	CheckCircle,
	AlertCircle,
	TrendingUp,
	Activity,
	RefreshCw,
} from "lucide-react";
import {
	getDashboardStats,
	getSystemStatus,
	getCitasEstadisticas,
	type DashboardStats,
	type SystemStatus,
} from "@/services/dashboardService";
import { Button } from "@/components/ui/button";

const pageHomeAdmin = () => {
	const [stats, setStats] = useState<DashboardStats>({
		totalUsuarios: 0,
		totalCitas: 0,
		citasHoy: 0,
		citasPendientes: 0,
		totalConsultas: 0,
		totalMedicos: 0,
		totalEspecialidades: 0,
		consultasHoy: 0,
		citasConfirmadas: 0,
		citasCanceladas: 0,
		citasCompletadas: 0,
		pacientesActivos: 0,
	});

	const [systemStatus, setSystemStatus] = useState<SystemStatus>({
		api: "active",
		database: "connected",
		services: "operational",
	});

	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchAllData = async () => {
		try {
			const [dashboardData, statusData] = await Promise.all([
				getDashboardStats(),
				getSystemStatus(),
			]);

			setStats(dashboardData);
			setSystemStatus(statusData);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	const handleRefresh = async () => {
		setRefreshing(true);
		await fetchAllData();
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
			case "connected":
			case "operational":
				return "text-green-600";
			case "maintenance":
				return "text-yellow-600";
			case "inactive":
			case "disconnected":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "active":
				return "Activo";
			case "connected":
				return "Conectada";
			case "operational":
				return "Operativos";
			case "maintenance":
				return "Mantenimiento";
			case "inactive":
				return "Inactivo";
			case "disconnected":
				return "Desconectada";
			default:
				return "Desconocido";
		}
	};

	if (loading) {
		return (
			<div className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
								<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
							</CardHeader>
							<CardContent>
								<div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
								<div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<Activity className="h-8 w-8 text-blue-600" />
						Dashboard CLINAPP
					</h1>
					<p className="text-gray-600 mt-2">
						Resumen general del sistema de gestión clínica
					</p>
				</div>
				<Button
					onClick={handleRefresh}
					disabled={refreshing}
					variant="outline"
					size="sm"
					className="flex items-center gap-2"
				>
					<RefreshCw
						className={`h-4 w-4 ${
							refreshing ? "animate-spin" : ""
						}`}
					/>
					Actualizar
				</Button>
			</div>

			{/* Estadísticas principales */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Total Usuarios
						</CardTitle>
						<Users className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-blue-600">
							{stats.totalUsuarios.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Usuarios registrados en el sistema
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Total Citas
						</CardTitle>
						<Calendar className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-green-600">
							{stats.totalCitas.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Citas registradas en total
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Citas Hoy
						</CardTitle>
						<Clock className="h-5 w-5 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-orange-600">
							{stats.citasHoy.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Citas programadas para hoy
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Citas Pendientes
						</CardTitle>
						<AlertCircle className="h-5 w-5 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-red-600">
							{stats.citasPendientes.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Citas pendientes de confirmación
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Estadísticas secundarias */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Total Consultas
						</CardTitle>
						<FileText className="h-5 w-5 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-purple-600">
							{stats.totalConsultas.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Consultas médicas realizadas
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Médicos Activos
						</CardTitle>
						<Stethoscope className="h-5 w-5 text-teal-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-teal-600">
							{stats.totalMedicos.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Médicos registrados activos
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Especialidades
						</CardTitle>
						<Building className="h-5 w-5 text-indigo-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-indigo-600">
							{stats.totalEspecialidades.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Especialidades médicas disponibles
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Consultas Hoy
						</CardTitle>
						<TrendingUp className="h-5 w-5 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-emerald-600">
							{stats.consultasHoy.toLocaleString()}
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Consultas realizadas hoy
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Información adicional */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-600" />
							Estado del Sistema
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Base de Datos
								</span>
								<span
									className={`text-sm font-medium ${getStatusColor(
										systemStatus.database
									)}`}
								>
									{getStatusText(systemStatus.database)}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5 text-blue-600" />
							Estadísticas por Estado
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Citas Confirmadas
								</span>
								<span className="text-sm font-medium text-green-600">
									{stats.citasConfirmadas.toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Citas Completadas
								</span>
								<span className="text-sm font-medium text-blue-600">
									{stats.citasCompletadas.toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Citas Canceladas
								</span>
								<span className="text-sm font-medium text-red-600">
									{stats.citasCanceladas.toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Pacientes Activos
								</span>
								<span className="text-sm font-medium text-purple-600">
									{stats.pacientesActivos.toLocaleString()}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Accesos Rápidos */}
			<Card className="hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5 text-blue-600" />
						Accesos Rápidos
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<a
							href="/admin/citas"
							className="block p-4 rounded-lg border hover:bg-gray-50 hover:border-blue-300 transition-all"
						>
							<div className="flex items-center gap-3">
								<Calendar className="h-5 w-5 text-blue-600" />
								<span className="text-sm font-medium">
									Ver Citas del Día
								</span>
							</div>
						</a>
						<a
							href="/admin/usuarios"
							className="block p-4 rounded-lg border hover:bg-gray-50 hover:border-blue-300 transition-all"
						>
							<div className="flex items-center gap-3">
								<Users className="h-5 w-5 text-blue-600" />
								<span className="text-sm font-medium">
									Gestionar Usuarios
								</span>
							</div>
						</a>
						<a
							href="/admin/medicos"
							className="block p-4 rounded-lg border hover:bg-gray-50 hover:border-blue-300 transition-all"
						>
							<div className="flex items-center gap-3">
								<Stethoscope className="h-5 w-5 text-blue-600" />
								<span className="text-sm font-medium">
									Ver Médicos
								</span>
							</div>
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default pageHomeAdmin;
