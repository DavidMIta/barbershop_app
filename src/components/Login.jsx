import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Toast } from "./Toast";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (isLogin) {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess("¡Bienvenido!");
        setEmail("");
        setPassword("");
      }
    } else {
      if (!name) {
        setError("Por favor ingresa tu nombre");
        return;
      }
      const result = register(email, password, name);
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess("¡Registro exitoso! Bienvenido a Barbershop.");
        setEmail("");
        setPassword("");
        setName("");
        setTimeout(() => setIsLogin(true), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {error && <Toast message={error} type="error" />}
      {success && <Toast message={success} type="success" />}

      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-amber-500 text-center mb-2">
          Barbershop
        </h1>
        <p className="text-gray-400 text-center mb-8">Reserva tu cita</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Juan Pérez"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {isLogin ? "Ingresar" : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="text-amber-500 hover:text-amber-400 font-medium mt-2 transition"
          >
            {isLogin ? "Crea una aquí" : "Inicia sesión"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-gray-300 text-xs font-medium mb-2">
            Demo Client:
          </p>
          <p className="text-gray-400 text-xs">Email: demo@barbershop.com</p>
          <p className="text-gray-400 text-xs">Password: 123456</p>
          <button
            type="button"
            onClick={() => {
              setEmail("demo@barbershop.com");
              setPassword("123456");
              const result = login("demo@barbershop.com", "123456");
              if (!result.success) {
                // Crear usuario demo automáticamente
                register("demo@barbershop.com", "123456", "Demo Usuario", "user");
              }
            }}
            className="mt-2 text-amber-500 hover:text-amber-400 text-xs font-medium transition"
          >
            Usar Demo Client
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-600">
          <p className="text-blue-300 text-xs font-medium mb-2">
            🔑 Demo Admin:
          </p>
          <p className="text-blue-400 text-xs">Email: admin@barbershop.com</p>
          <p className="text-blue-400 text-xs">Password: admin123</p>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@barbershop.com");
              setPassword("admin123");
              const result = login("admin@barbershop.com", "admin123");
              if (!result.success) {
                // Crear usuario admin automáticamente
                register("admin@barbershop.com", "admin123", "Admin Barbershop", "admin");
              }
            }}
            className="mt-2 text-blue-400 hover:text-blue-300 text-xs font-medium transition"
          >
            Usar Demo Admin
          </button>
        </div>
      </div>
    </div>
  );
}
