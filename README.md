# Barbershop Reservas App

Una aplicación web moderna para reservas de barbería construida con React, Tailwind CSS y Vite.

## Características

✨ **Sistema de Reservas**

- Formulario intuitivo con date picker y time slots dinámicos
- Sistema automático de disponibilidad
- Evita solapamiento de citas

🔐 **Autenticación Local**

- Login y registro sin backend
- Sesión persistente en localStorage
- Cuenta de prueba incluida

📱 **Panel de Usuario**

- Listado de mis reservas
- Información de fecha, hora, servicio y precio
- Botón para cancelar citas futuras

💇 **Servicios**

- Corte (45 min) - $25
- Lavado + Corte (75 min) - $40
- Tinte + Corte + Lavado (120 min) - $60

🎨 **Diseño Moderno**

- Dark theme profesional
- Interfaz responsiva
- Animaciones y feedback visual
- Toast notifications

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

## Estructura del Proyecto

```
barbershop_app/
├── src/
│   ├── components/
│   │   ├── Login.jsx           # Componente de autenticación
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   ├── ReservaForm.jsx     # Formulario de reservas
│   │   ├── ListaReservas.jsx   # Listado de mis reservas
│   │   └── Toast.jsx           # Notificaciones
│   ├── context/
│   │   └── AuthContext.jsx     # Context de autenticación
│   ├── utils/
│   │   └── timeSlots.js        # Lógica de horarios y servicios
│   ├── App.jsx                 # Componente principal
│   └── main.jsx                # Punto de entrada
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Uso

### Crear Cuenta

1. Haz clic en "Crea una aquí" en la pantalla de login
2. Ingresa tu nombre, email y contraseña
3. Serás redirigido automáticamente a login

### Usar Cuenta Demo

- Email: `demo@barbershop.com`
- Password: `123456`
- Haz clic en el botón "Usar demo" para acceso rápido

### Hacer una Reserva

1. Completa tu nombre
2. Selecciona un servicio (duración y precio se mostran automáticamente)
3. Elige una fecha (no permite fechas pasadas)
4. Selecciona una hora disponible
5. Confirma tu reserva

### Gestionar Reservas

- Ve a la pestaña "Mis Reservas"
- Ve el detalle de tus citas confirmadas
- Cancela citas futuras con el botón "Cancelar"
- Las citas pasadas se muestran como referencia

## Tecnologías

- **React 18** - Librería de UI con Hooks
- **Vite** - Herramienta de build rápida
- **Tailwind CSS** - Framework CSS moderno
- **Context API** - Gestión de estado global
- **localStorage** - Persistencia de datos

## Características de Seguridad

- Validación de entrada en todos los formularios
- Manejo seguro de sesiones
- Protección contra XSS con React
- Datos almacenados localmente (sin backend)

## Mejoras Futuras

- [ ] Backend con base de datos
- [ ] Sistema de pagos
- [ ] Notificaciones por email
- [ ] Panel de administrador
- [ ] Estadísticas de reservas
- [ ] Multi-idioma
- [ ] Categorías de barberos

## Licencia

MIT
