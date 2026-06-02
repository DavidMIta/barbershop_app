import { useState } from "react";
import { useSupabase } from "./context/SupabaseContext";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { ReservaForm } from "./components/ReservaForm";
import { ListaReservas } from "./components/ListaReservas";
import { AdminPanel } from "./components/AdminPanel";
import { AdminMisReservas } from "./components/AdminMisReservas";

function AppContent() {
  const { user } = useSupabase();
  const isAdmin = user?.user_metadata?.role === "admin";
  const [activeTab, setActiveTab] = useState(
    isAdmin ? "dashboard" : "reservas",
  );

  // Cambiar a pestaña de mis reservas después de una reserva exitosa
  const handleReservaExitosa = () => {
    setActiveTab("misreservas");
  };

  if (!user) {
    return <Login />;
  }

  // INTERFACE PARA ADMINISTRADOR
  if (isAdmin) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Tabs Navigation para Admin */}
            <div className="flex gap-4 mb-8 border-b border-gray-700">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-3 px-4 font-semibold transition ${
                  activeTab === "dashboard"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab("misreservas")}
                className={`py-3 px-4 font-semibold transition ${
                  activeTab === "misreservas"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Servicios Pendientes
              </button>
            </div>

            {/* Content Admin */}
            <div className="grid grid-cols-1 gap-8">
              {activeTab === "dashboard" && <AdminPanel />}
              {activeTab === "misreservas" && <AdminMisReservas />}
            </div>
          </div>
        </main>
      </>
    );
  }

  // INTERFACE PARA USUARIO REGULAR
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Tabs Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("reservas")}
              className={`py-3 px-4 font-semibold transition ${
                activeTab === "reservas"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Nueva Reserva
            </button>
            <button
              onClick={() => setActiveTab("misreservas")}
              className={`py-3 px-4 font-semibold transition ${
                activeTab === "misreservas"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Mis Reservas
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {activeTab === "reservas" && (
                <ReservaForm onReservaExitosa={handleReservaExitosa} />
              )}
              {activeTab === "misreservas" && <ListaReservas />}
            </div>

            {/* Sidebar */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 h-fit">
              <h3 className="text-xl font-bold text-amber-500 mb-4">
                ℹ️ Información
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Horario de atención
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Lunes a Viernes: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-400 text-sm">
                    Sábado: 10:00 AM - 4:00 PM
                  </p>
                  <p className="text-gray-400 text-sm">Domingo: Cerrado</p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Servicios</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✂️ Corte - $25</li>
                    <li>💇 Lavado + Corte - $40</li>
                    <li>🎨 Tinte + Corte + Lavado - $60</li>
                  </ul>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Políticas</h4>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Llega 10 min antes</li>
                    <li>• Cancela con 24h de anticipación</li>
                    <li>• Max 2 reservas por día</li>
                  </ul>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Contacto</h4>
                  <p className="text-gray-400 text-sm">📞 (555) 123-4567</p>
                  <p className="text-gray-400 text-sm">
                    📧 info@barbershop.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
