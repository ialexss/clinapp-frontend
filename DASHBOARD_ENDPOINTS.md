# Endpoints necesarios para el Dashboard Service

Necesitas crear los siguientes endpoints en tu backend Laravel (apiclinicas):

## 1. Estadísticas del Dashboard
**GET** `/api/dashboard/stats`

Respuesta esperada:
```json
{
  "data": {
    "totalUsuarios": 156,
    "totalCitas": 342,
    "citasHoy": 12,
    "citasPendientes": 8,
    "totalConsultas": 289,
    "totalMedicos": 24,
    "totalEspecialidades": 8,
    "consultasHoy": 6,
    "citasConfirmadas": 45,
    "citasCanceladas": 12,
    "citasCompletadas": 89,
    "pacientesActivos": 98
  }
}
```

## 2. Estado del Sistema
**GET** `/api/dashboard/system-status`

Respuesta esperada:
```json
{
  "data": {
    "api": "active",
    "database": "connected",
    "services": "operational"
  }
}
```

## 3. Estadísticas de Citas
**GET** `/api/dashboard/citas-stats`

Respuesta esperada:
```json
{
  "data": {
    "confirmadas": 45,
    "pendientes": 8,
    "canceladas": 12,
    "completadas": 89
  }
}
```

## 4. Estadísticas de Consultas
**GET** `/api/dashboard/consultas-stats`

Respuesta esperada:
```json
{
  "data": {
    "hoy": 6,
    "esteMes": 54,
    "esteAnio": 289,
    "total": 456
  }
}
```

## Controlador Laravel Sugerido

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Cita;
use App\Models\Consulta;
use App\Models\Medico;
use App\Models\Especialidad;
use App\Models\Paciente;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalUsuarios = User::count();
        $totalCitas = Cita::count();
        $citasHoy = Cita::whereDate('fecha', Carbon::today())->count();
        $citasPendientes = Cita::where('estado', 'pendiente')->count();
        $totalConsultas = Consulta::count();
        $totalMedicos = Medico::count();
        $totalEspecialidades = Especialidad::count();
        $consultasHoy = Consulta::whereDate('created_at', Carbon::today())->count();
        $citasConfirmadas = Cita::where('estado', 'confirmada')->count();
        $citasCanceladas = Cita::where('estado', 'cancelada')->count();
        $citasCompletadas = Cita::where('estado', 'completada')->count();
        $pacientesActivos = Paciente::where('activo', true)->count();

        return response()->json([
            'data' => [
                'totalUsuarios' => $totalUsuarios,
                'totalCitas' => $totalCitas,
                'citasHoy' => $citasHoy,
                'citasPendientes' => $citasPendientes,
                'totalConsultas' => $totalConsultas,
                'totalMedicos' => $totalMedicos,
                'totalEspecialidades' => $totalEspecialidades,
                'consultasHoy' => $consultasHoy,
                'citasConfirmadas' => $citasConfirmadas,
                'citasCanceladas' => $citasCanceladas,
                'citasCompletadas' => $citasCompletadas,
                'pacientesActivos' => $pacientesActivos,
            ]
        ]);
    }

    public function systemStatus()
    {
        // Verificar estado de la base de datos
        try {
            \DB::connection()->getPdo();
            $database = 'connected';
        } catch (\Exception $e) {
            $database = 'disconnected';
        }

        return response()->json([
            'data' => [
                'api' => 'active',
                'database' => $database,
                'services' => 'operational'
            ]
        ]);
    }

    public function citasStats()
    {
        return response()->json([
            'data' => [
                'confirmadas' => Cita::where('estado', 'confirmada')->count(),
                'pendientes' => Cita::where('estado', 'pendiente')->count(),
                'canceladas' => Cita::where('estado', 'cancelada')->count(),
                'completadas' => Cita::where('estado', 'completada')->count(),
            ]
        ]);
    }

    public function consultasStats()
    {
        return response()->json([
            'data' => [
                'hoy' => Consulta::whereDate('created_at', Carbon::today())->count(),
                'esteMes' => Consulta::whereMonth('created_at', Carbon::now()->month)->count(),
                'esteAnio' => Consulta::whereYear('created_at', Carbon::now()->year)->count(),
                'total' => Consulta::count(),
            ]
        ]);
    }
}
```

## Rutas a agregar en routes/api.php

```php
Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/system-status', [DashboardController::class, 'systemStatus']);
    Route::get('/citas-stats', [DashboardController::class, 'citasStats']);
    Route::get('/consultas-stats', [DashboardController::class, 'consultasStats']);
});
```
