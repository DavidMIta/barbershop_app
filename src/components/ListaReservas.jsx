import { useEffect, useState } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { obtenerServicioInfo, formatearFecha } from "../utils/timeSlots";
import { Toast, useToast } from "./Toast";

export function ListaReservas() {
  const { user, supabase } = useSupabase();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast } = useToast();

  useEffect(() => {
    cargarReservas();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel("reservations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservations",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          cargarReservas();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: true });

      if (error) throw error;
      setReservas(data);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      showToast("Error cargando reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservaId) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      try {
        const { error } = await supabase
          .from("reservations")
          .delete()
          .eq("id", reservaId);

        if (error) throw error;
        showToast("Reserva cancelada", "error");
        cargarReservas();
      } catch (error) {
        console.error("Error cancelando reserva:", error);
        showToast("Error al cancelar la reserva", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700 text-center">
        <p className="text-gray-400">Cargando tus reservas...</p>
      </div>
    );
  }

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
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
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
            const servicio = obtenerServicioInfo(reserva.service);
            const fechaObj = new Date(`${reserva.date}T${reserva.time}`);
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
                      {reserva.completed ? (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          ✅ Completada
                        </span>
                      ) : esPasada ? (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          Pasada
                        </span>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Fecha</p>
                        <p className="text-white font-medium">
                          {formatearFecha(reserva.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Hora</p>
                        <p className="text-white font-medium">{reserva.time}</p>
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

                  {!esPasada && !reserva.completed && (
                    <button
                      onClick={() => handleCancel(reserva.id)}
                      className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
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
