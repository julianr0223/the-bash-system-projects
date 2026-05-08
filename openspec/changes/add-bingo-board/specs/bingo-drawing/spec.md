## ADDED Requirements

### Requirement: Extracción aleatoria sin repetición
El sistema SHALL extraer un número aleatorio entre 1 y 75 cada vez que el usuario active la acción "Sacar número", excluyendo siempre los ya cantados, hasta agotar las 75 bolas.

#### Scenario: Sacar primer número
- **WHEN** el usuario pulsa "SACAR NÚMERO" con el tablero vacío
- **THEN** el sistema selecciona uniformemente al azar un entero del conjunto `{1..75}`
- **AND** lo añade al final del historial de cantados
- **AND** lo marca como `latest` (último cantado)

#### Scenario: Sacar número con cantados previos
- **WHEN** el usuario pulsa "SACAR NÚMERO" y existen N números cantados (N < 75)
- **THEN** el sistema selecciona uniformemente al azar un entero del conjunto `{1..75} \ cantados`
- **AND** el número resultante NO está en el historial previo

#### Scenario: Tablero completo
- **WHEN** los 75 números han sido cantados y el usuario pulsa "SACAR NÚMERO"
- **THEN** el sistema NO modifica el estado
- **AND** muestra un toast "¡Tablero completo!"

#### Scenario: Doble pulsación durante extracción
- **WHEN** la animación de extracción está activa y el usuario pulsa "SACAR NÚMERO" de nuevo
- **THEN** el sistema ignora la segunda pulsación
- **AND** el botón está deshabilitado visualmente (`disabled`)

### Requirement: Animación de extracción
El sistema SHALL mostrar una animación de "drum-roll" (sacudida) durante aproximadamente 900 ms antes de revelar el número extraído, para reforzar la sensación de sorteo.

#### Scenario: Animación al sacar
- **WHEN** el usuario pulsa "SACAR NÚMERO"
- **THEN** el botón pasa a estado "SACANDO…" deshabilitado
- **AND** la zona de la bola muestra animación de sacudida
- **AND** tras ~900 ms se revela el número con animación de aparición (scale + rotate)

### Requirement: Deshacer último cantado
El sistema SHALL permitir eliminar el último número cantado sin afectar a los anteriores.

#### Scenario: Deshacer con historial
- **WHEN** existen N números cantados (N ≥ 1) y el usuario pulsa "DESHACER"
- **THEN** el sistema elimina el último elemento del historial
- **AND** `latest` pasa a apuntar al penúltimo (o `null` si N = 1)
- **AND** muestra toast "Último número eliminado"

#### Scenario: Deshacer sin historial
- **WHEN** el historial está vacío
- **THEN** el botón "DESHACER" está deshabilitado y no realiza acción

#### Scenario: Deshacer durante extracción
- **WHEN** una extracción está en curso
- **THEN** el botón "DESHACER" está deshabilitado

### Requirement: Reinicio de partida con confirmación
El sistema SHALL permitir reiniciar la partida (vaciar historial) requiriendo confirmación explícita del usuario.

#### Scenario: Reiniciar con historial
- **WHEN** existen números cantados y el usuario pulsa "REINICIAR"
- **THEN** el sistema muestra un modal "¿REINICIAR PARTIDA?" con el conteo actual
- **AND** ofrece botones "CANCELAR" y "REINICIAR"

#### Scenario: Confirmar reinicio
- **WHEN** el usuario confirma en el modal de reinicio
- **THEN** el historial queda vacío, `latest` pasa a `null`
- **AND** el modal se cierra
- **AND** se cancela cualquier locución de voz pendiente
- **AND** muestra toast "Partida reiniciada"

#### Scenario: Cancelar reinicio
- **WHEN** el usuario pulsa "CANCELAR" o hace click fuera del modal
- **THEN** el modal se cierra sin modificar el estado

#### Scenario: Reiniciar sin historial
- **WHEN** el historial está vacío
- **THEN** el botón "REINICIAR" está deshabilitado

### Requirement: Persistencia local del estado
El sistema SHALL persistir el estado de la partida en `localStorage` y restaurarlo al cargar la app, para que sobreviva a refrescos de página.

#### Scenario: Guardado tras cada cambio
- **WHEN** el historial, el último cantado o el estado de voz cambian
- **THEN** el sistema escribe el objeto `{drawn, latest, voiceOn}` bajo la clave `bingo-state-v1`

#### Scenario: Restauración al cargar
- **WHEN** la app carga y existe un valor válido en `bingo-state-v1`
- **THEN** el sistema restaura `drawn`, `latest` y `voiceOn` desde ese valor
- **AND** el tablero refleja los números ya cantados sin reproducir voz

#### Scenario: Almacenamiento corrupto
- **WHEN** el valor en `localStorage` no es un JSON válido o no cumple la forma esperada
- **THEN** el sistema arranca con estado vacío sin lanzar error
