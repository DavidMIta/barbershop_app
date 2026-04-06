import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { obtenerServicioInfo, formatearFecha } from "../utils/timeSlots";
import { Toast, useToast } from "./Toast";

export function AdminPanel() {
  const { getAllReservas, cancelReserva, getUserById, toggleReservaCompletada } = useAuth();
  const { toasts, showToast } = useToast();
  const [filterOpciones, setFilterOpciones] = useState("todas"); // todas, proximas, pasadas

  const allReservas = getAllReservas();
  const { toasts: localToasts, showToast: localShowToast } = useToast();

  const handleCancel = (reservaId, nombreCliente) => {
    if (window.confirm(`¿Cancelar reserva de ${nombreCliente}?`)) {
      cancelReserva(reservaId);
      localShowToast(`Reserva de ${nombreCliente} cancelada`, "error");
    }
  };

  const handleToggleCompletada = (reservaId, nombreCliente) => {
    toggleReservaCompletada(reservaId);
    localShowToast(`Servicio de ${nombreCliente} actualizado`, "success");
  };

  // Filtrar reservas
  const reservasFiltradas = allReservas.filter((reserva) => {
    const fechaObj = new Date(`${reserva.fecha}T${reserva.hora}`);
    const ahora = new Date();

    if (filterOpciones === "proximas") {
      return fechaObj >= ahora;
    } else if (filterOpciones === "pasadas") {
      return fechaObj < ahora;
    }
    return true;
  });

  // Ordenar por fecha (más recientes primero)
  const reservasOrdenadas = [...reservasFiltradas].sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.hora}`);
    const dateB = new Date(`${b.fecha}T${b.hora}`);
    return dateB - dateA;
  });

  // Estadísticas
  const ahora = new Date();
  const statsProximas = allReservas.filter(
    (r) => new Date(`${r.fecha}T${r.hora}`) >= ahora,
  ).length;
  const statsPasadas = allReservas.filter(
    (r) => new Date(`${r.fecha}T${r.hora}`) < ahora,
  ).length;
  const statsCompletadas = allReservas.filter((r) => r.completada).length;
  const statsPendientes = allReservas.length - statsCompletadas;

  if (allReservas.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-amber-500 mb-4">
          📊 Panel de Administrador
        </h2>
        <p className="text-gray-400">
          No hay reservas aún. Esperando que los clientes hagan sus bookings...
        </p>
      </div>
    );
  }

  return (
    <div>
      {localToasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}

      <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
          📊 Panel de Administrador
        </h2>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <p className="text-gray-400 text-sm">Total Reservas</p>
            <p className="text-3xl font-bold text-amber-500">
              {allReservas.length}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <p className="text-gray-400 text-sm">Próximas Citas</p>
            <p className="text-3xl font-bold text-blue-500">{statsProximas}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <p className="text-gray-400 text-sm">Citas Pasadas</p>
            <p className="text-3xl font-bold text-gray-500">{statsPasadas}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border border-green-600">
            <p className="text-gray-400 text-sm">✅ Completadas</p>
            <p className="text-3xl font-bold text-green-500">{statsCompletadas}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border border-orange-600">
            <p className="text-gray-400 text-sm">⏳ Pendientes</p>
            <p className="text-3xl font-bold text-orange-500">{statsPendientes}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilterOpciones("todas")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterOpciones === "todas"
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterOpciones("proximas")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterOpciones === "proximas"
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Próximas
          </button>
          <button
            onClick={() => setFilterOpciones("pasadas")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterOpciones === "pasadas"
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Pasadas
          </button>
        </div>

        {/* Tabla de reservas */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Cliente
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Fecha
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Hora
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Servicio
                </th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">
                  Duración
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                  Precio
                </th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">
                  Estado
                </th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {reservasOrdenadas.map((reserva) => {
                const servicio = obtenerServicioInfo(reserva.servicio);
                const usuario = getUserById(reserva.userId);
                const fechaObj = new Date(`${reserva.fecha}T${reserva.hora}`);
                const esPasada = fechaObj < ahora;

                return (
                  <tr
                    key={reserva.id}
                    className={`border-b border-gray-700 hover:bg-gray-700/50 transition ${
                      esPasada ? "opacity-60" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {reserva.nombre}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {usuario?.email || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatearFecha(reserva.fecha)}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {reserva.hora}
                    </td>
                    <td className="py-3 px-4 text-amber-400">
                      {servicio.name}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-center">
                      {servicio.duration} min
                    </td>
                    <td className="py-3 px-4 text-amber-500 font-medium text-right">
                      ${servicio.price}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          handleToggleCompletada(reserva.id, reserva.nombre)
                        }
                        className={`inline-flex items-center justify-center w-6 h-6 rounded border-2 transition ${
                          reserva.completada
                            ? "bg-green-600 border-green-600"
                            : "border-gray-500 hover:border-green-500"
                        }`}
                        title={reserva.completada ? "Marcar como pendiente" : "Marcar como completada"}
                      >
                        {reserva.completada && (
                          <span className="text-white font-bold">✓</span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {!esPasada && (
                        <button
                          onClick={() =>
                            handleCancel(reserva.id, reserva.nombre)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded transition text-xs"
                        >
                          Cancelar
                        </button>
                      )}
                      {esPasada && (
                        <span className="text-gray-500 text-xs">Pasada</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {reservasOrdenadas.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No hay reservas en esta categoría
          </div>
        )}
      </div>
    </div>
  );
}
