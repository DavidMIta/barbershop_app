import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💇</span>
            <h1 className="text-2xl font-bold text-amber-500">Barbershop</h1>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">
                  Hola,{" "}
                  <span className="font-semibold text-white">
                    {currentUser.name}
                  </span>
                </span>
                {currentUser.role === "admin" && (
                  <span className="bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded">
                    🔑 ADMIN
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
