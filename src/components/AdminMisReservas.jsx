import { useAuth } from "../context/AuthContext";
import { obtenerServicioInfo, formatearFecha } from "../utils/timeSlots";
import { Toast, useToast } from "./Toast";

export function AdminMisReservas() {
  const { getReservasUsuario, toggleReservaCompletada, cancelReserva } =
    useAuth();
  const reservas = getReservasUsuario();
  const { toasts, showToast } = useToast();

  const handleCancel = (reservaId, nombreReserva) => {
    if (window.confirm(`¿Cancelar reserva de ${nombreReserva}?`)) {
      cancelReserva(reservaId);
      showToast("Reserva cancelada", "error");
    }
  };

  const handleToggleCompletada = (reservaId, nombreReserva) => {
    toggleReservaCompletada(reservaId);
    showToast(`Servicio de ${nombreReserva} actualizado`, "success");
  };

  if (reservas.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">
          Servicios Pendientes
        </h2>
        <p className="text-gray-400">
          No tienes servicios registrados. ¡Crea el primero! 💇
        </p>
      </div>
    );
  }

  // Ordenar reservas por fecha (más recientes primero)
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.hora}`);
    const dateB = new Date(`${b.fecha}T${b.hora}`);
    return dateB - dateA;
  });

  return (
    <div>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}

      <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">
          Servicios Pendientes
        </h2>

        <div className="space-y-4">
          {reservasOrdenadas.map((reserva) => {
            const servicio = obtenerServicioInfo(reserva.servicio);
            const fechaObj = new Date(`${reserva.fecha}T${reserva.hora}`);
            const esPasada = fechaObj < new Date();

            return (
              <div
                key={reserva.id}
                className={`border rounded-lg p-5 transition ${
                  reserva.completada
                    ? "bg-green-900/20 border-green-600 opacity-60"
                    : "bg-gray-700 border-blue-500 hover:border-blue-400"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {servicio.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {reserva.completada && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                            ✅ Completado
                          </span>
                        )}
                        {esPasada && !reserva.completada && (
                          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                            Pasado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Fecha</p>
                        <p className="text-white font-medium">
                          {formatearFecha(reserva.fecha)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Hora</p>
                        <p className="text-white font-medium">{reserva.hora}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duración</p>
                        <p className="text-white font-medium">
                          {servicio.duration} minutos
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Precio</p>
                        <p className="text-blue-400 font-medium">
                          ${servicio.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleToggleCompletada(reserva.id, servicio.name)
                      }
                      className={`font-medium py-2 px-4 rounded-lg transition text-sm white-nowrap ${
                        reserva.completada
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {reserva.completada ? "✅ Completado" : "⏳ Marcar"}
                    </button>

                    {!esPasada && (
                      <button
                        onClick={() => handleCancel(reserva.id, servicio.name)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
