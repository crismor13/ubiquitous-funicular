# 💻 Gestor de Agentes de IA - Frontend

Esta es la **interfaz de usuario** para el _Gestor de Agentes de Inteligencia Artificial_.  
Es una aplicación moderna y reactiva construida con **Next.js (React)** y **TypeScript**, diseñada para consumir la API del backend.

La interfaz permite una gestión visual e intuitiva de los agentes, su base de conocimiento y la interacción a través de un chat en tiempo real.

---

## 📋 Características Implementadas

- **Dashboard de Agentes:** Visualización de todos los agentes existentes en formato de tarjetas.
- **Creación de Agentes:** Modal para crear nuevos agentes de forma sencilla.
- **Vista de Detalles:** Página dedicada para cada agente que muestra su prompt, documentos y el chat.
- **Chat Interactivo:** Permite conversar con cada agente obteniendo respuestas basadas en su base de conocimiento.
- **Gestión de Documentos:** Subida y eliminación de archivos asociados a cada agente.
- **Edición y Eliminación:** Modales y diálogos de confirmación para actualizar o eliminar agentes.
- **Notificaciones:** Sistema de _toasts_ para feedback del usuario (por ejemplo, “Agente creado con éxito”).

---

## 🛠️ Stack Tecnológico

| Categoría          | Tecnología               |
| ------------------ | ------------------------ |
| **Framework**      | Next.js 14+ (App Router) |
| **Lenguaje**       | TypeScript               |
| **Estilos**        | Tailwind CSS             |
| **Componentes UI** | Shadcn/ui                |
| **HTTP Client**    | Axios                    |
| **Formularios**    | React Hook Form          |

---

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto localmente:

### 1️⃣ Prerrequisitos

- Node.js **18 o superior**
- El servidor **backend** debe estar en ejecución

---

### 2️⃣ Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd frontend-folder
```

---

### 3️⃣ Instalar Dependencias

```bash
npm install
```

---

### 4️⃣ Conexión con el Backend

Asegúrate de que la URL del backend esté correctamente configurada en el archivo `src/services/api.ts`.  
Por defecto, apunta a `http://127.0.0.1:8000`.

```typescript
// src/services/api.ts
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // Modificar si es necesario
  // ...
});
```

---

### 5️⃣ Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura del Proyecto

```
src/
├── app/                    # Rutas de la aplicación (Next.js App Router)
│   ├── page.tsx            # Página principal (lista de agentes)
│   └── agents/[agentId]/   # Página dinámica con detalles de cada agente
│
├── components/             # Componentes reutilizables (modales, diálogos, etc.)
│   └── ui/                 # Componentes generados por Shadcn/ui
│
└── services/               # Comunicación con la API del backend
    └── api.ts
```

---

## 📁 Licencia

Este proyecto es de código privado y está protegido bajo los derechos de su respectivo autor o entidad propietaria.  
Para uso interno o académico, se recomienda solicitar autorización previa.
