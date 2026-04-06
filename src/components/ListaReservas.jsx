import { useAuth } from "../context/AuthContext";
import { obtenerServicioInfo, formatearFecha } from "../utils/timeSlots";
import { Toast, useToast } from "./Toast";

export function ListaReservas() {
  const { getReservasUsuario, cancelReserva } = useAuth();
  const reservas = getReservasUsuario();
  const { toasts, showToast } = useToast();

  const handleCancel = (reservaId) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      cancelReserva(reservaId);
      showToast("Reserva cancelada", "error");
    }
  };

  if (reservas.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-amber-500 mb-4">Mis Reservas</h2>
        <p className="text-gray-400">
          No tienes reservas aún. ¡Crea una nueva para visitarnos! 💇
        </p>
      </div>
    );
  }

  // Ordenar reservas por fecha y hora
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.hora}`);
    const dateB = new Date(`${b.fecha}T${b.hora}`);
    return dateB - dateA; // Más recientes primero
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
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Mis Reservas</h2>

        <div className="space-y-4">
          {reservasOrdenadas.map((reserva) => {
            const servicio = obtenerServicioInfo(reserva.servicio);
            const fechaObj = new Date(`${reserva.fecha}T${reserva.hora}`);
            const esPasada = fechaObj < new Date();

            return (
              <div
                key={reserva.id}
                className={`border rounded-lg p-4 transition ${
                  esPasada
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-700 border-amber-500 hover:border-amber-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {servicio.name}
                      </h3>
                      {esPasada && (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          Pasada
                        </span>
                      )}
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
                        <p className="text-amber-500 font-medium">
                          ${servicio.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!esPasada && (
                    <button
                      onClick={() => handleCancel(reserva.id)}
                      className="ml-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm white-nowrap"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
