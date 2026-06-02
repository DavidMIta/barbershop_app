# 🚀 Configuración de Supabase

## Paso 1: Crear un proyecto en Supabase

1. Vé a [app.supabase.com](https://app.supabase.com)
2. Crea una cuenta (o inicia sesión si tienes una)
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name**: `barbershop-app`
   - **Database Password**: Guarda en un lugar seguro
   - **Region**: Selecciona la más cercana a ti
5. Espera a que el proyecto se cree (5-10 minutos)

## Paso 2: Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL** (en la sección de API)
   - **anon public** (clave pública)

## Paso 3: Configurar variables de entorno

1. Abre `.env.local` en la raíz del proyecto
2. Reemplaza los valores:
   ```
   VITE_SUPABASE_URL=tu_url_aqui
   VITE_SUPABASE_ANON_KEY=tu_clave_publica_aqui
   ```
3. Guarda el archivo (NO commitees este archivo a Git)

## Paso 4: Crear tablas en Supabase

Ve a **SQL Editor** en Supabase y ejecuta el siguiente SQL:

### Tabla de Usuarios (el perfil del usuario)

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

### Tabla de Reservas

```sql
CREATE TABLE public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  service TEXT NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo ven sus propias reservas (excepto admins)
CREATE POLICY "Users can view own reservations"
  ON public.reservations
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Política: Los usuarios pueden crear reservas
CREATE POLICY "Users can create reservations"
  ON public.reservations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus reservas
CREATE POLICY "Users can update own reservations"
  ON public.reservations
  FOR UPDATE
  USING (auth.uid() = user_id);
```

## Paso 5: Usar Supabase en tu app

### En `main.jsx`, reemplaza el provider:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.css";
import { SupabaseProvider } from "./context/SupabaseContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </React.StrictMode>,
);
```

### En tus componentes, usa el hook:

```jsx
import { useSupabase } from "../context/SupabaseContext";

export function MiComponente() {
  const { user, login, logout, supabase } = useSupabase();

  const handleLogin = async () => {
    const result = await login("user@example.com", "password");
    if (result.success) {
      console.log("Login exitoso!");
    }
  };

  return <button onClick={handleLogin}>Iniciar sesión</button>;
}
```

## Paso 6: Migrar datos del localStorage (opcional)

Si quieres migrar tus datos actuales a Supabase:

```jsx
import { supabase } from "./lib/supabase";

async function migrateData() {
  const users = JSON.parse(localStorage.getItem("barbershop_users") || "[]");

  for (const user of users) {
    await supabase.from("profiles").insert({
      email: user.email,
      full_name: user.name,
      role: user.role,
    });
  }
}
```

## 🔐 Seguridad

- ✅ Nunca compartas tu `.env.local`
- ✅ Usa Row Level Security (RLS) en todas las tablas
- ✅ Guarda claves secretas en variables de entorno
- ✅ Considera usar variables de entorno adicionales para producción

## 📚 Recursos

- [Docs de Supabase](https://supabase.com/docs)
- [Autenticación con React](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time subscriptions](https://supabase.com/docs/guides/realtime)
