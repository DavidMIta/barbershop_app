// EJEMPLOS DE USO: Operaciones comunes con Supabase

import { useSupabase } from "../context/SupabaseContext";
import { useState, useEffect } from "react";

// ============================================
// 1. OPERACIONES CON RESERVAS
// ============================================

export function ListaReservasSupabase() {
  const { user, supabase } = useSupabase();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todas las reservas del usuario actual
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
        (payload) => {
          console.log("Cambio en reservas:", payload);
          cargarReservas(); // Recargar cuando hay cambios
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
    } finally {
      setLoading(false);
    }
  };

  const eliminarReserva = async (id) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      cargarReservas(); // Recargar
    } catch (error) {
      console.error("Error eliminando reserva:", error);
    }
  };

  const marcarComoCompletada = async (id) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ completed: true })
        .eq("id", id);

      if (error) throw error;
      cargarReservas();
    } catch (error) {
      console.error("Error actualizando reserva:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-4">
      {reservas.length === 0 ? (
        <p>No tienes reservas</p>
      ) : (
        reservas.map((reserva) => (
          <div key={reserva.id} className="bg-gray-800 p-4 rounded">
            <p className="font-bold">{reserva.service}</p>
            <p>
              {reserva.date} a las {reserva.time}
            </p>
            <button
              onClick={() => eliminarReserva(reserva.id)}
              className="mt-2 px-3 py-1 bg-red-500 rounded"
            >
              Cancelar
            </button>
            {!reserva.completed && (
              <button
                onClick={() => marcarComoCompletada(reserva.id)}
                className="mt-2 px-3 py-1 bg-green-500 rounded ml-2"
              >
                Marcar completada
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ============================================
// 2. PANEL ADMIN - Ver todas las reservas
// ============================================

export function AdminReservasSupabase() {
  const { supabase } = useSupabase();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTodasLasReservas();

    // Suscribirse a todos los cambios en reservas
    const subscription = supabase
      .channel("all_reservations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservations",
        },
        () => {
          cargarTodasLasReservas();
        },
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const cargarTodasLasReservas = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*, profiles(full_name, email)")
        .order("date", { ascending: true });

      if (error) throw error;
      setReservas(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Cliente</th>
            <th className="p-2">Servicio</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Hora</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id} className="border-b">
              <td className="p-2">{reserva.name}</td>
              <td className="p-2">{reserva.service}</td>
              <td className="p-2">{reserva.date}</td>
              <td className="p-2">{reserva.time}</td>
              <td className="p-2">
                {reserva.completed ? "✅ Completada" : "⏳ Pendiente"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// 3. OPERACIONES CON PERFILES DE USUARIO
// ============================================

export function PerfilUsuarioSupabase() {
  const { user, supabase } = useSupabase();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, [user?.id]);

  const cargarPerfil = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no row found
      setPerfil(data);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async (nuevoNombre) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: nuevoNombre })
        .eq("id", user?.id);

      if (error) throw error;
      cargarPerfil();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <p>Nombre: {perfil?.full_name || "Sin nombre"}</p>
      <p>Email: {perfil?.email}</p>
      <p>Rol: {perfil?.role}</p>
      <button
        onClick={() => actualizarPerfil("Nuevo nombre")}
        className="mt-4 px-4 py-2 bg-blue-500 rounded"
      >
        Actualizar nombre
      </button>
    </div>
  );
}

// ============================================
// 4. BUSCAR RESERVAS POR RANGO DE FECHAS
// ============================================

export function ReservasPorFecha() {
  const { supabase } = useSupabase();
  const [reservas, setReservas] = useState([]);

  const buscarReservas = async (fechaInicio, fechaFin) => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .gte("date", fechaInicio) // mayor o igual a
        .lte("date", fechaFin) // menor o igual a
        .order("date");

      if (error) throw error;
      setReservas(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => buscarReservas("2024-01-01", "2024-01-31")}
        className="px-4 py-2 bg-blue-500 rounded"
      >
        Ver reservas de enero
      </button>
      <p>Encontradas: {reservas.length}</p>
    </div>
  );
}

// ============================================
// 5. CARGAR IMAGEN A STORAGE
// ============================================

export function CargarFoto() {
  const { user, supabase } = useSupabase();
  const [cargando, setCargando] = useState(false);

  const subirFoto = async (archivo) => {
    try {
      setCargando(true);
      const extension = archivo.name.split(".").pop();
      const nombreArchivo = `${user.id}/perfil.${extension}`;

      const { error } = await supabase.storage
        .from("avatars") // Crea este bucket en Supabase
        .upload(nombreArchivo, archivo, { upsert: true });

      if (error) throw error;

      // Obtener URL pública
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(nombreArchivo);

      console.log("Foto subida:", data.publicUrl);
    } catch (error) {
      console.error("Error subiendo foto:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => subirFoto(e.target.files[0])}
        disabled={cargando}
      />
      {cargando && <p>Subiendo...</p>}
    </div>
  );
}
