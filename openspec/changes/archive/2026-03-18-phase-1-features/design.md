## Context

La app de rutinas diarias tiene 5 capabilities: routine-management, daily-checkin, daily-agenda, dashboard, y progress-tracking. Actualmente todas las rutinas son de frecuencia diaria. Se necesitan tres mejoras transversales: frecuencias flexibles, reportes de progreso, y badges de logros. Todo sigue corriendo en localStorage por ahora (backend vendrá en Fase 2).

## Goals / Non-Goals

**Goals:**
- Frecuencias flexibles: daily, weekdays (L-V), custom (días específicos)
- Reportes: resumen semanal comparativo, tendencia 30 días, progreso por rutina con meta opcional
- Badges: sistema simple de logros predefinidos con reglas sobre completions
- Compatibilidad total con rutinas existentes (frequency='daily' sigue funcionando)

**Non-Goals:**
- Frecuencia "cada N días" (intervalo)
- Notificaciones/recordatorios (Fase 2)
- Backend o auth (Fase 2)
- Badges personalizables por el usuario
- Reportes exportables

## Decisions

### 1. Tipo de frecuencia: union type simple

**Decisión**: `frequency: 'daily' | 'weekdays' | { days: number[] }` donde days usa 0=domingo, 1=lunes... 6=sábado (convención JavaScript Date.getDay()).

**Alternativas consideradas**:
- **Enum string ('daily' | 'weekdays' | 'mon-wed-fri')**: Limitado, no permite combinaciones arbitrarias
- **Siempre array de días**: Más uniforme, pero pierde la semántica simple de 'daily'/'weekdays'

**Razón**: Cubre el 95% de los casos de uso. 'daily' y 'weekdays' son shortcuts semánticos que simplifican la UI. Custom days cubre todo lo demás.

### 2. Función `appliesToDay`: lógica centralizada

**Decisión**: Una única función `appliesToDay(frequency, date): boolean` en utils que todos los componentes usan para filtrar rutinas.

**Razón**: Evita duplicar la lógica de frecuencia en cada componente. Un solo lugar para mantener.

### 3. Rachas adaptadas a frecuencia

**Decisión**: La racha cuenta "días consecutivos aplicables donde se completó". Si una rutina aplica L-M-V y se completó L y M, la racha es 2 aunque haya un martes en medio (porque martes no aplica).

**Razón**: Es la única interpretación justa. Penalizar por días no-aplicables rompería la motivación.

### 4. Badges: definiciones estáticas evaluadas en runtime

**Decisión**: Los badges se definen como un array constante de objetos `{ id, name, description, condition(completions, routines) => boolean }`. Se evalúan cada vez que se accede a la vista de badges. Sin almacenamiento separado — se computan de los datos existentes.

**Alternativas consideradas**:
- **Almacenar badges desbloqueados**: Añade complejidad de sync si se borran completions
- **Event-driven (evaluar al completar)**: Más eficiente pero más complejo

**Razón**: Con el volumen de datos de localStorage, evaluar todas las reglas es instantáneo. Sin estado adicional que mantener sincronizado.

### 5. Metas por rutina: campo opcional en Routine

**Decisión**: Agregar `goal?: number` a Routine — número de veces por semana que el usuario quiere completar la rutina (ej. 5 de 7 días). El reporte compara goal vs completions reales de la semana.

**Razón**: Simple, un solo número. No necesita sistema de metas separado.

### 6. Vista de reportes: nueva ruta, no dentro de Stats

**Decisión**: Crear una nueva ruta `/reports` con su componente dedicado, separada de la vista Stats existente.

**Alternativas consideradas**:
- **Extender Stats**: Acoplaría estadísticas instantáneas con reportes históricos

**Razón**: Reports tiene contexto temporal (semana, mes) mientras Stats es snapshot del momento. Responsabilidades distintas.

## Risks / Trade-offs

- **[Migración de frequency]** → Rutinas existentes tienen `frequency: 'daily'` como string. Mitigation: el tipo union lo incluye, no hay breaking change real en datos.
- **[Performance de badges]** → Evaluar todas las reglas en cada render. Mitigation: volumen pequeño en localStorage, memoizar con useMemo si es necesario.
- **[Complejidad de streak con frecuencias]** → El cálculo se vuelve más complejo. Mitigation: función bien testeada y aislada en utils.
- **[Goal sin frecuencia context]** → Un goal de 5/semana en una rutina weekdays (5 días) es 100%, pero en custom 3 días es imposible. Mitigation: validar que goal <= días aplicables por semana.
