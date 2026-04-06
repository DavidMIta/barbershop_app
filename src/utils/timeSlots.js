const SERVICOS = {
  corte: {
    name: "Corte",
    duration: 45, // minutos
    price: 25,
  },
  lavado_corte: {
    name: "Lavado + Corte",
    duration: 75,
    price: 40,
  },
  tinte_corte_lavado: {
    name: "Tinte + Corte + Lavado",
    duration: 120,
    price: 60,
  },
};

// Generar slots de 30 minutos
export function generarTimeSlots(fecha, reservas) {
  const horaInicio = 9; // 9 AM
  const horaFin = 18; // 6 PM
  const intervalo = 30; // minutos

  const slots = [];
  const fechaStr = new Date(fecha).toISOString().split("T")[0];

  for (let hora = horaInicio; hora < horaFin; hora++) {
    for (let minuto = 0; minuto < 60; minuto += intervalo) {
      const timeStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
      const disponible = isSlotDisponible(fechaStr, timeStr, reservas);
      slots.push({
        time: timeStr,
        disponible,
      });
    }
  }

  return slots;
}

function isSlotDisponible(fecha, hora, reservas) {
  const [horaSlot, minutoSlot] = hora.split(":").map(Number);
  const tiempoSlot = horaSlot * 60 + minutoSlot;

  return !reservas.some((reserva) => {
    if (reserva.fecha !== fecha) return false;

    const [horaReserva, minutoReserva] = reserva.hora.split(":").map(Number);
    const tiempoReserva = horaReserva * 60 + minutoReserva;
    const duracion = SERVICOS[reserva.servicio].duration;

    const reservaFin = tiempoReserva + duracion;

    // Verificar si hay solapamiento
    return tiempoSlot >= tiempoReserva && tiempoSlot < reservaFin;
  });
}

export function obtenerServicios() {
  return Object.entries(SERVICOS).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

export function obtenerServicioInfo(servicioId) {
  return SERVICOS[servicioId];
}

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Validar que la fecha no sea en el pasado
export function isValidarFecha(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaSeleccionada = new Date(fecha);
  fechaSeleccionada.setHours(0, 0, 0, 0);
  return fechaSeleccionada >= hoy;
}

// Obtener el mínimo de fecha (hoy)
export function obtenerFechaMinima() {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
}
