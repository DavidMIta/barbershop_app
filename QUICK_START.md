# 📋 Guía Rápida de Implementación

## ¿Qué se ha instalado y creado?

✅ **Paquete Supabase instalado**: `@supabase/supabase-js`

✅ **5 archivos creados:**

1. `src/lib/supabase.js` - Cliente de Supabase
2. `src/context/SupabaseContext.jsx` - Context para autenticación
3. `src/components/ReservaFormSupabase.jsx` - Formulario con Supabase
4. `src/components/EjemplosSupabase.jsx` - Ejemplos de operaciones
5. `.env.local` - Variables de entorno
6. `SUPABASE_SETUP.md` - Documentación completa

---

## ⚡ Pasos rápidos para empezar

### 1️⃣ Crear proyecto Supabase (2 min)

```
1. Ir a https://app.supabase.com
2. Click "New Project"
3. Nombre: barbershop-app
4. Guardar contraseña
5. Esperar 5-10 minutos
```

### 2️⃣ Obtener credenciales (1 min)

```
1. En Supabase: Settings → API
2. Copiar Project URL
3. Copiar anon public key
```

### 3️⃣ Configurar .env.local (1 min)

```
Abrir: .env.local

VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

### 4️⃣ Crear tablas (5 min)

```
1. En Supabase: SQL Editor
2. Copiar + ejecutar el SQL de SUPABASE_SETUP.md
3. Crear primero: profiles table
4. Luego: reservations table
```

### 5️⃣ Actualizar main.jsx (1 min)

```jsx
import { SupabaseProvider } from "./context/SupabaseContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </React.StrictMode>,
);
```

### 6️⃣ Usar en componentes (2 min)

```jsx
import { useSupabase } from "../context/SupabaseContext";

export function MiComponente() {
  const { user, login, logout } = useSupabase();

  // Ya funciona!
}
```

---

## 📊 Comparación: Antes vs Después

### ANTES (localStorage)

```jsx
const savedUsers = localStorage.getItem("barbershop_users");
setUsers(JSON.parse(savedUsers));
```

### DESPUÉS (Supabase)

```jsx
const { data } = await supabase.from("users").select("*");
setUsers(data);
```

---

## 💡 Ejemplos de uso

### Login

```jsx
const result = await login("user@email.com", "password");
if (result.success) console.log("Login exitoso");
```

### Crear reserva

```jsx
const { data } = await supabase
  .from("reservations")
  .insert([{ user_id, name, date, time, service }]);
```

### Obtener mis reservas

```jsx
const { data: reservas } = await supabase
  .from("reservations")
  .select("*")
  .eq("user_id", user.id);
```

### Actualizar reserva

```jsx
await supabase
  .from("reservations")
  .update({ completed: true })
  .eq("id", reservaId);
```

### Real-time (escuchar cambios)

```jsx
supabase
  .channel("reservations")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "reservations" },
    (payload) => console.log("Cambio:", payload),
  )
  .subscribe();
```

---

## 🚨 Errores comunes

**Error: "Supabase credentials not configured"**
→ Revisa que `.env.local` tenga las variables correctas

**Error: "Not authenticated"**
→ El usuario no ha iniciado sesión, usa `useSupabase()` en componente dentro de `<SupabaseProvider>`

**Error en base de datos**
→ Verifica que la tabla exista en Supabase y que el RLS no esté bloqueando

---

## 📚 Archivos de referencia

- **SUPABASE_SETUP.md** - Setup completo con SQL
- **src/components/EjemplosSupabase.jsx** - Código listo para copiar
- **src/context/SupabaseContext.jsx** - El context principal

---

## ❓ ¿Necesitas ayuda?

- Lee: `SUPABASE_SETUP.md`
- Mira ejemplos: `src/components/EjemplosSupabase.jsx`
- Docs oficiales: https://supabase.com/docs

¡Listo! 🎉
