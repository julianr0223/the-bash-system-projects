## ADDED Requirements

### Requirement: Layout de dos columnas en escritorio
El sistema SHALL presentar en escritorio (≥ 961px) dos columnas: la columna del cantador a la izquierda y el tablero 1-75 a la derecha, ambos visibles dentro de la altura del viewport sin requerir scroll global de página.

#### Scenario: Render en escritorio
- **WHEN** el ancho de viewport es ≥ 961px
- **THEN** el `main` usa `grid-template-columns: 1fr 1.35fr` con gap 20px
- **AND** la altura total del `main` es `calc(100vh - alto_topbar)` con `min-height: 580px`
- **AND** la columna izquierda y la derecha son visibles sin scroll de página

#### Scenario: Render en móvil
- **WHEN** el ancho de viewport es ≤ 960px
- **THEN** las columnas colapsan a una sola (flujo vertical) con padding reducido
- **AND** la altura es `auto` (sin restricción de viewport)

### Requirement: Bola del último cantado
El sistema SHALL mostrar el último número cantado como una bola grande con la letra de columna (B-I-N-G-O) encima del número, coloreada según la columna correspondiente, con efectos de brillo y reflejo.

#### Scenario: Bola con número cantado
- **WHEN** existe un `latest`
- **THEN** la bola muestra la letra correspondiente (1-15:B, 16-30:I, 31-45:N, 46-60:G, 61-75:O) y el número
- **AND** el color de la bola y el `box-shadow` glow usan la variable de color de su columna
- **AND** un halo radial detrás de la bola hereda el mismo color

#### Scenario: Estado inicial sin cantados
- **WHEN** no hay `latest`
- **THEN** se muestra un placeholder circular punteado con el texto "PULSA SACAR PARA EMPEZAR"

#### Scenario: Animación de aparición
- **WHEN** se revela un nuevo `latest`
- **THEN** la bola se anima con escala y rotación durante ~700 ms

### Requirement: Tablero 1-75 en cinco columnas
El sistema SHALL renderizar las 75 casillas en cinco columnas (B, I, N, G, O), 15 filas cada una, con encabezados de columna estilizados con el color correspondiente.

#### Scenario: Estructura del tablero
- **WHEN** se renderiza el tablero
- **THEN** existen 5 encabezados de columna (B, I, N, G, O) con borde y fondo en su color
- **AND** debajo de cada encabezado se muestran 15 celdas con sus números (B:1-15, I:16-30, N:31-45, G:46-60, O:61-75)

#### Scenario: Celda no cantada
- **WHEN** un número aún no ha sido cantado
- **THEN** la celda se muestra con fondo neutro tenue, borde sutil y texto en color atenuado

#### Scenario: Celda cantada
- **WHEN** un número está en el historial de cantados
- **THEN** la celda toma el color sólido de su columna como fondo, texto oscuro de alto contraste y un `box-shadow` glow del mismo color
- **AND** se anima con un "pop" (scale 0.5 → 1.15 → 1) durante ~500 ms al pasar a cantada

#### Scenario: Resaltar el más reciente
- **WHEN** una celda corresponde al `latest`
- **THEN** se le aplica un `outline` blanco de 2px con `outline-offset: 2px`

### Requirement: Scroll interno del tablero
El sistema SHALL permitir scroll vertical dentro de la tarjeta del tablero sin que el contenedor afecte al layout global, manteniendo visibles encabezado y barra de progreso.

#### Scenario: Tablero sin scroll necesario
- **WHEN** el contenido del tablero cabe en la altura disponible
- **THEN** no se muestra barra de scroll

#### Scenario: Tablero con desbordamiento
- **WHEN** el contenido del tablero excede la altura disponible
- **THEN** aparece scroll vertical interno (no horizontal)
- **AND** las 5 columnas (incluida la O) son completamente visibles sin recorte derecho
- **AND** el encabezado "TABLERO 1—75" y la barra de progreso permanecen fijos arriba

### Requirement: Topbar con marca y métricas
El sistema SHALL mostrar una barra superior pegada (sticky) con la marca "BINGO 75 · TABLERO DE REGISTRO", el contador de cantados/restantes y el toggle de voz.

#### Scenario: Render del topbar
- **WHEN** la app carga
- **THEN** el topbar muestra: logo (cuadrado con gradiente y letra "B"), texto "BINGO 75" + subtítulo "TABLERO DE REGISTRO"
- **AND** dos pills mostrando "CANTADOS X/75" y "RESTAN Y"
- **AND** un toggle "VOZ ON/OFF"
- **AND** queda fijo en la parte superior al hacer scroll

### Requirement: Historial de últimos cantados
El sistema SHALL mostrar las últimas N mini-bolas cantadas (N ≤ 12) en orden cronológico inverso (la más reciente primero), con scroll horizontal si exceden el ancho.

#### Scenario: Sin cantados
- **WHEN** el historial está vacío
- **THEN** se muestra el texto "Aún no se ha cantado ningún número."

#### Scenario: Con cantados
- **WHEN** existen 1 ≤ K ≤ 12 cantados
- **THEN** se muestran K mini-bolas en orden inverso (último primero), cada una coloreada según su columna
- **AND** el label muestra "ÚLTIMOS CANTADOS · K de M" donde M = total cantados

#### Scenario: Más de 12 cantados
- **WHEN** existen K > 12 cantados
- **THEN** se muestran solo las 12 más recientes
- **AND** la lista permite scroll horizontal si no caben en el ancho disponible

### Requirement: Barra de progreso
El sistema SHALL mostrar una barra de progreso lineal indicando el porcentaje de números cantados sobre 75.

#### Scenario: Progreso visible
- **WHEN** existen K cantados
- **THEN** la barra se llena al `(K/75)*100`% con gradiente magenta→púrpura y glow
- **AND** se muestra el texto "X% COMPLETADO" o "SIN NÚMEROS CANTADOS" si K=0

### Requirement: Estética neón oscuro
El sistema SHALL aplicar la paleta neón oscura definida en el diseño: fondo radial casi negro, rejilla sutil, acentos de color por columna en `oklch`, tipografías Bebas Neue / Sora / JetBrains Mono.

#### Scenario: Variables de color por columna
- **WHEN** se renderizan elementos asociados a una columna
- **THEN** usan las variables CSS exactas: `--B: oklch(70% 0.22 350)`, `--I: oklch(78% 0.18 50)`, `--N: oklch(82% 0.20 130)`, `--G: oklch(75% 0.18 220)`, `--O: oklch(72% 0.22 290)`

#### Scenario: Fondo de la app
- **WHEN** la app se renderiza
- **THEN** el `body` usa gradiente radial `#15152e` → `#07070d` → `#000`
- **AND** una rejilla de 60×60px con líneas blancas a 2.5% opacidad superpone el fondo, enmascarada radialmente
