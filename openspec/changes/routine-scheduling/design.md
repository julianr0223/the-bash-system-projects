## Context

La app de rutinas diarias ya funciona con un modelo simple: rutinas se crean, se marcan como completadas, y se rastrean rachas. Pero no tienen concepto de horario. Los usuarios quieren planificar su día con bloques de tiempo específicos y ver una agenda cronológica.

El modelo actual `Routine` tiene: `id, name, description, category, frequency, createdAt, isActive`. Se necesita extender con campos de tiempo opcionales para mantener compatibilidad con rutinas existentes.

## Goals / Non-Goals

**Goals:**
- Agregar campos opcionales `startTime` y `endTime` al modelo de rutina
- Nueva vista de agenda diaria que muestra rutinas como bloques de tiempo ordenados cronológicamente
- Formulario de rutinas actualizado con selectores de hora
- Compatibilidad total con rutinas existentes sin horario

**Non-Goals:**
- Detección de conflictos/solapamiento de horarios
- Rutinas que abarcan múltiples días
- Integración con calendarios externos (Google Calendar, etc.)
- Drag-and-drop para reorganizar horarios

## Decisions

### 1. Formato de tiempo: strings HH:mm

**Decisión**: Almacenar `startTime` y `endTime` como strings en formato `"HH:mm"` (24h).

**Alternativas consideradas**:
- **Minutos desde medianoche (number)**: Más eficiente para comparaciones, pero menos legible al depurar
- **Date completo (ISO)**: Excesivo — solo necesitamos hora del día, no fecha

**Razón**: Simple, legible, y fácil de formatear para display. Comparaciones lexicográficas funcionan correctamente para ordenar (`"08:00" < "09:30"`).

### 2. Campos opcionales, no obligatorios

**Decisión**: `startTime` y `endTime` son opcionales (`string | undefined`). Las rutinas sin horario siguen funcionando igual.

**Razón**: No rompe datos existentes. Los usuarios pueden tener rutinas "sueltas" (ej. "Leer antes de dormir") sin hora fija.

### 3. Vista de agenda como componente nuevo

**Decisión**: Crear un componente `DailyAgenda` nuevo en lugar de modificar el `DailyCheckin` existente.

**Alternativas consideradas**:
- **Modificar DailyCheckin**: Acopla dos responsabilidades (checklist vs agenda temporal)
- **Reemplazar DailyCheckin**: Pierde la vista simple de checklist

**Razón**: Cada vista tiene un propósito distinto. La agenda muestra la dimensión temporal, el check-in es una lista rápida de completado. Ambas coexisten.

### 4. Ordenamiento en DailyCheckin

**Decisión**: Las rutinas con horario se ordenan por `startTime` primero, seguidas de las que no tienen horario.

**Razón**: Mantiene la vista de check-in útil sin forzar al usuario a ir a la agenda.

## Risks / Trade-offs

- **[Migración de datos]** → Las rutinas existentes en localStorage no tienen `startTime`/`endTime`. Mitigation: los campos son opcionales, el código trata `undefined` como "sin horario".
- **[Validación de horarios]** → El usuario podría poner `endTime` antes de `startTime`. Mitigation: validar en el formulario que `endTime > startTime` cuando ambos están presentes.
- **[Complejidad visual]** → La agenda puede verse vacía si no hay rutinas con horario. Mitigation: mostrar un estado vacío que sugiera agregar horarios a las rutinas existentes.
