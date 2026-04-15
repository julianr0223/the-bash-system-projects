## ADDED Requirements

### Requirement: Lista de rutinas ordenada por horario
La página `/routines`, en su vista Lista, SHALL mostrar las rutinas de cada categoría ordenadas por `startTime` ascendente. Las rutinas sin `startTime` SHALL colocarse al final del grupo de su categoría, ordenadas alfabéticamente por `name`.

#### Scenario: Ordenamiento básico con horarios diferentes
- **WHEN** una categoría contiene rutinas con `startTime` 06:00, 18:00 y 13:00
- **THEN** la vista Lista las muestra en el orden 06:00, 13:00, 18:00

#### Scenario: Mezcla de rutinas con y sin horario
- **WHEN** una categoría tiene rutinas con `startTime` (p.ej. 08:00, 21:00) y otras sin `startTime` (p.ej. "Leer", "Meditar")
- **THEN** primero aparecen las de horario en orden ascendente (08:00, 21:00) y luego las sin horario ordenadas alfabéticamente (Leer, Meditar)

#### Scenario: Empate por startTime idéntico
- **WHEN** dos rutinas en la misma categoría tienen el mismo `startTime`
- **THEN** el sistema las ordena por `name` ascendente como criterio de desempate

### Requirement: Toggle de vista Lista/Calendario
La página `/routines` SHALL exponer un control para alternar entre vista "Lista" y vista "Calendario". La elección SHALL persistirse en `localStorage` bajo la clave `routinesViewMode` y restaurarse en la siguiente visita.

#### Scenario: Primera visita del usuario
- **WHEN** el usuario abre `/routines` por primera vez sin valor previo en `localStorage`
- **THEN** se muestra la vista Lista por defecto

#### Scenario: Cambio de vista persistente
- **WHEN** el usuario cambia a vista Calendario y recarga la página
- **THEN** la vista Calendario se muestra nuevamente sin intervención del usuario

#### Scenario: Cambio de vista en la misma sesión
- **WHEN** el usuario alterna el toggle
- **THEN** la vista se actualiza inmediatamente sin recargar la página

### Requirement: Vista Calendario — grilla horaria diaria
La vista Calendario SHALL renderizar una grilla vertical que represente las 24 horas del día, con bloques visuales posicionados según `startTime` y `endTime` de cada rutina activa. Todas las categorías SHALL mostrarse en una sola columna, diferenciadas por color de fondo del bloque.

#### Scenario: Bloque con inicio y fin definidos
- **WHEN** una rutina tiene `startTime` 08:00 y `endTime` 12:00
- **THEN** su bloque ocupa verticalmente el espacio correspondiente a 4 horas comenzando en la línea de las 08:00

#### Scenario: Bloque con solo startTime
- **WHEN** una rutina tiene `startTime` 19:00 y no tiene `endTime`
- **THEN** su bloque se renderiza como un marcador de duración mínima (p.ej. 15 minutos o altura fija pequeña) en la línea de las 19:00

#### Scenario: Color por categoría
- **WHEN** la vista Calendario renderiza rutinas de varias categorías
- **THEN** cada bloque usa un color de fondo consistente asociado a su categoría, y categorías distintas tienen colores distintos

#### Scenario: Solape horario entre rutinas
- **WHEN** dos rutinas tienen rangos horarios que se solapan (p.ej. 13:00-15:00 y 14:00-15:00)
- **THEN** ambos bloques se muestran visibles (p.ej. lado a lado dentro de la misma franja horaria) sin que uno tape al otro

### Requirement: Sección "Sin horario" en vista Calendario
La vista Calendario SHALL mostrar, debajo de la grilla horaria, una sección titulada "Sin horario" que agrupe todas las rutinas activas sin `startTime`.

#### Scenario: Rutina sin startTime
- **WHEN** existe una rutina activa sin `startTime`
- **THEN** aparece en la sección "Sin horario" y NO aparece dentro de la grilla horaria

#### Scenario: No hay rutinas sin horario
- **WHEN** todas las rutinas activas tienen `startTime`
- **THEN** la sección "Sin horario" NO se renderiza (o se muestra vacía sin tarjetas)

### Requirement: Edición desde la vista Calendario
Un bloque en la vista Calendario SHALL ser clickeable, y al activarse abrir el mismo formulario de edición (`RoutineForm`) usado por la vista Lista.

#### Scenario: Click en bloque abre editor
- **WHEN** el usuario hace click en un bloque de la grilla horaria
- **THEN** se abre el `RoutineForm` precargado con los datos de esa rutina

#### Scenario: Guardar cambios desde el calendario
- **WHEN** el usuario modifica el `startTime` de una rutina desde el editor abierto por el calendario y guarda
- **THEN** el bloque se reposiciona inmediatamente según el nuevo horario
