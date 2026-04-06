import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [users, setUsers] = useState([]);

  // Cargar datos del localStorage al montar
  useEffect(() => {
    const savedUsers = localStorage.getItem("barbershop_users");
    const savedReservas = localStorage.getItem("barbershop_reservas");
    const savedCurrentUser = localStorage.getItem("barbershop_currentUser");

    if (savedUsers) {
      // Migrar usuarios sin role field a role: "user"
      const parsedUsers = JSON.parse(savedUsers).map(user => ({
        ...user,
        role: user.role || "user"
      }));
      setUsers(parsedUsers);
    }
    if (savedReservas) {
      // Migrar reservas sin completada field a completada: false
      const parsedReservas = JSON.parse(savedReservas).map(reserva => ({
        ...reserva,
        completada: reserva.completada || false
      }));
      setReservas(parsedReservas);
    }
    if (savedCurrentUser) {
      const parsedUser = JSON.parse(savedCurrentUser);
      setCurrentUser({
        ...parsedUser,
        role: parsedUser.role || "user"
      });
    }
  }, []);

  // Guardar usuarios en localStorage
  useEffect(() => {
    localStorage.setItem("barbershop_users", JSON.stringify(users));
  }, [users]);

  // Guardar reservas en localStorage
  useEffect(() => {
    localStorage.setItem("barbershop_reservas", JSON.stringify(reservas));
  }, [reservas]);

  // Guardar usuario actual en localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "barbershop_currentUser",
        JSON.stringify(currentUser),
      );
    } else {
      localStorage.removeItem("barbershop_currentUser");
    }
  }, [currentUser]);

  const register = (email, password, name, role = "user") => {
    const userExists = users.some((u) => u.email === email);
    if (userExists) {
      return { success: false, error: "El email ya está registrado" };
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      role
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      return { success: false, error: "Email o contraseña incorrectos" };
    }
    setCurrentUser({
      ...user,
      role: user.role || "user"
    });
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addReserva = (reserva) => {
    const newReserva = {
      id: Date.now(),
      ...reserva,
      userId: currentUser.id,
      completada: false,
    };
    setReservas([...reservas, newReserva]);
    return newReserva;
  };

  const cancelReserva = (reservaId) => {
    setReservas(reservas.filter((r) => r.id !== reservaId));
  };

  const getReservasUsuario = () => {
    if (!currentUser) return [];
    return reservas.filter((r) => r.userId === currentUser.id);
  };

  const getAllReservas = () => {
    return reservas;
  };

  const getReservasByUser = (userId) => {
    return reservas.filter((r) => r.userId === userId);
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === "admin";
  };

  const getUserById = (userId) => {
    return users.find((u) => u.id === userId);
  };

  const toggleReservaCompletada = (reservaId) => {
    setReservas(
      reservas.map((r) =>
        r.id === reservaId ? { ...r, completada: !r.completada } : r
      )
    );
  };

  const updateReservaStatus = (reservaId, completada) => {
    setReservas(
      reservas.map((r) =>
        r.id === reservaId ? { ...r, completada } : r
      )
    );
  };

  const getEstadisticas = () => {
    const total = reservas.length;
    const completadas = reservas.filter((r) => r.completada).length;
    const pendientes = total - completadas;
    const ahora = new Date();
    const proximas = reservas.filter(
      (r) => new Date(`${r.fecha}T${r.hora}`) >= ahora
    ).length;
    const pasadas = total - proximas;

    return {
      total,
      completadas,
      pendientes,
      proximas,
      pasadas,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        reservas,
        register,
        login,
        logout,
        addReserva,
        cancelReserva,
        getReservasUsuario,
        getAllReservas,
        getReservasByUser,
        isAdmin,
        getUserById,
        toggleReservaCompletada,
        updateReservaStatus,
        getEstadisticas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
