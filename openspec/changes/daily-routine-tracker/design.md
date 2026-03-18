## Context

Se construye una nueva aplicación web de tracking de rutinas diarias desde cero. No existe estado previo ni infraestructura a reutilizar. El objetivo es una herramienta simple, rápida y enfocada en el uso diario para seguimiento de hábitos recurrentes.

## Goals / Non-Goals

**Goals:**
- Aplicación web SPA funcional para gestionar y dar seguimiento a rutinas diarias
- Experiencia fluida de check-in diario (mínima fricción para marcar rutinas)
- Visualización clara de progreso y rachas (streaks)
- Persistencia local sin necesidad de backend inicialmente
- Diseño responsive para uso en móvil y desktop

**Non-Goals:**
- Autenticación de usuarios o multi-tenancy (v1 es single-user, local)
- Sincronización entre dispositivos o backend remoto
- Notificaciones push o recordatorios
- Gamificación avanzada (badges, niveles, rewards)
- Exportación/importación de datos

## Decisions

### 1. Stack tecnológico: React + TypeScript + Vite

**Decisión**: Usar React con TypeScript y Vite como bundler.

**Alternativas consideradas**:
- **Vue.js**: Viable, pero React tiene ecosistema más amplio para componentes de calendario/visualización
- **Vanilla JS**: Menor overhead pero más código boilerplate para estado reactivo y componentes

**Razón**: React ofrece un modelo de componentes maduro, excelente tooling con TypeScript, y Vite proporciona desarrollo rápido con HMR.

### 2. Persistencia: localStorage con estructura JSON

**Decisión**: Usar localStorage del navegador para persistir rutinas y registros de completado.

**Alternativas consideradas**:
- **IndexedDB**: Más potente pero excesivo para el volumen de datos esperado
- **Backend con API REST**: Añade complejidad innecesaria para v1 single-user

**Razón**: localStorage es simple, síncrono y suficiente para el volumen de datos de un usuario individual. La estructura de datos se diseña para ser migrable a un backend futuro.

### 3. Modelo de datos

**Decisión**: Dos entidades principales:
- **Routine**: `{ id, name, description, category, frequency, createdAt, isActive }`
- **CompletionRecord**: `{ routineId, date, completedAt }`

Los registros de completado se indexan por fecha (YYYY-MM-DD) para búsquedas rápidas del día actual y cálculos de racha.

### 4. Estilos: CSS Modules

**Decisión**: Usar CSS Modules para estilos con scope local por componente.

**Alternativas consideradas**:
- **Tailwind CSS**: Rápido para prototipar pero genera markup verbose
- **styled-components**: Runtime overhead innecesario

**Razón**: CSS Modules ofrece encapsulamiento sin dependencias adicionales ni runtime overhead.

### 5. Vista de calendario: librería ligera o implementación propia

**Decisión**: Implementar un componente de heatmap/calendario simple propio (estilo GitHub contribution graph).

**Razón**: Las librerías de calendario completas son excesivas. Un grid simple de celdas coloreadas por nivel de completado es suficiente y mantiene las dependencias mínimas.

## Risks / Trade-offs

- **[Límite de localStorage]** → Los datos están limitados a ~5MB. Mitigation: suficiente para años de datos de rutinas; si se excede, migrar a IndexedDB.
- **[Pérdida de datos al limpiar navegador]** → localStorage se borra con clear browsing data. Mitigation: documentar limitación; futura versión puede añadir export/import.
- **[Sin sincronización multi-dispositivo]** → Single-device por diseño en v1. Mitigation: la estructura de datos está diseñada para ser serializable y migrable a backend.
- **[Cálculo de rachas puede ser costoso]** → Si hay muchos registros históricos. Mitigation: calcular rachas incrementalmente y cachear el resultado.
