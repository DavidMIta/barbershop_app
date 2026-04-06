import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  generarTimeSlots,
  obtenerServicios,
  formatearFecha,
  obtenerFechaMinima,
  isValidarFecha,
} from "../utils/timeSlots";
import { Toast } from "./Toast";

export function ReservaForm({ onReservaExitosa }) {
  const { addReserva, reservas } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    servicio: "corte",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const servicios = obtenerServicios();

  const timeSlots = useMemo(() => {
    if (!formData.fecha) return [];
    return generarTimeSlots(formData.fecha, reservas);
  }, [formData.fecha, reservas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
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

    // Crear reserva
    const reserva = addReserva({
      nombre: formData.nombre,
      fecha: formData.fecha,
      hora: formData.hora,
      servicio: formData.servicio,
    });

    if (reserva) {
      setSuccess("¡Reserva confirmada! Te esperamos 💇");
      setFormData({
        nombre: "",
        fecha: "",
        hora: "",
        servicio: "corte",
      });
      if (onReservaExitosa) {
        setTimeout(() => onReservaExitosa(reserva), 500);
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      {error && <Toast message={error} type="error" />}
      {success && <Toast message={success} type="success" />}

      <h2 className="text-2xl font-bold text-amber-500 mb-6">NuevaReserva</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Tu nombre"
          />
        </div>

        {/* Servicio */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Servicio *
          </label>
          <select
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - {s.duration} min - ${s.price}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Fecha *
          </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            min={obtenerFechaMinima()}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          {formData.fecha && (
            <p className="text-gray-400 text-sm mt-1">
              {formatearFecha(formData.fecha)}
            </p>
          )}
        </div>

        {/* Hora */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Hora *
          </label>
          {formData.fecha ? (
            <select
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="">-- Selecciona una hora --</option>
              {timeSlots.map((slot, idx) => (
                <option
                  key={idx}
                  value={slot.time}
                  disabled={!slot.disponible}
                  className={!slot.disponible ? "bg-gray-600" : ""}
                >
                  {slot.time} {!slot.disponible && "(No disponible)"}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Selecciona una fecha primero
            </p>
          )}
        </div>

        {/* Botón enviar */}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-6"
        >
          Reservar cita
        </button>
      </form>
    </div>
  );
}
