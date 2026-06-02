// EJEMPLO: Cómo adaptar ReservaForm para usar Supabase

import { useState, useMemo } from "react";
import { useSupabase } from "../context/SupabaseContext";
import {
  generarTimeSlots,
  obtenerServicios,
  formatearFecha,
  obtenerFechaMinima,
  isValidarFecha,
} from "../utils/timeSlots";
import { Toast } from "./Toast";

export function ReservaFormSupabase({ onReservaExitosa }) {
  const { user, supabase } = useSupabase();
  const [reservas, setReservas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    servicio: "corte",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const servicios = obtenerServicios();

  const timeSlots = useMemo(() => {
    if (!formData.fecha) return [];
    return generarTimeSlots(formData.fecha, reservas);
  }, [formData.fecha, reservas]);

  // Cargar reservas existentes del día seleccionado
  const cargarReservasDel = async (fecha) => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("date", fecha);

      if (error) throw error;
      setReservas(data || []);
    } catch (err) {
      console.error("Error cargando reservas:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Si cambió la fecha, cargar reservas del día
    if (name === "fecha" && value) {
      cargarReservasDel(value);
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!formData.nombre.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    if (!formData.fecha) {
      setError("Por favor selecciona una fecha");
      return;
    }

    if (!isValidarFecha(formData.fecha)) {
      setError("Por favor selecciona una fecha válida");
      return;
    }

    if (!formData.hora) {
      setError("Por favor selecciona una hora");
      return;
    }

    if (!formData.servicio) {
      setError("Por favor selecciona un servicio");
      return;
    }

    setLoading(true);

    try {
      // Crear reserva en Supabase
      const { data, error } = await supabase
        .from("reservations")
        .insert([
          {
            user_id: user.id,
            name: formData.nombre,
            email: user.email,
            date: formData.fecha,
            time: formData.hora,
            service: formData.servicio,
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSuccess("¡Reserva confirmada! Te esperamos 💇");
      setFormData({
        nombre: "",
        fecha: "",
        hora: "",
        servicio: "corte",
      });

      if (onReservaExitosa) {
        setTimeout(() => onReservaExitosa(data), 500);
      }
    } catch (err) {
      setError(err.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      {error && <Toast message={error} type="error" />}
      {success && <Toast message={success} type="success" />}

      <h2 className="text-2xl font-bold text-amber-500 mb-6">Nueva Reserva</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            min={obtenerFechaMinima()}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Hora */}
        {timeSlots.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Hora Disponible
            </label>
            <select
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Selecciona una hora</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Servicio */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Servicio
          </label>
          <select
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            {servicios.map((servicio) => (
              <option key={servicio} value={servicio}>
                {servicio.charAt(0).toUpperCase() + servicio.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Confirmar Reserva"}
        </button>
      </form>
    </div>
  );
}
