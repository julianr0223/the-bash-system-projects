## ADDED Requirements

### Requirement: Anuncio por voz del número cantado
El sistema SHALL anunciar por voz el número extraído usando la Web Speech API (SpeechSynthesis) en español cuando la opción de voz esté activada.

#### Scenario: Voz activa al sacar
- **WHEN** la voz está ON y se revela un nuevo `latest` con letra L y número N
- **THEN** el sistema invoca `speechSynthesis.speak` con el texto `"L, N"` (p.ej. "B, 7")
- **AND** la utterance usa `lang = 'es-ES'`, `rate = 0.85`, `pitch = 1.0`, `volume = 1.0`
- **AND** si hay una voz disponible cuyo `lang` empiece por `es`, la utterance usa esa voz

#### Scenario: Voz desactivada
- **WHEN** la voz está OFF y se revela un nuevo `latest`
- **THEN** el sistema NO invoca `speechSynthesis.speak`

#### Scenario: Cancelar locución previa
- **WHEN** se inicia una nueva locución mientras otra estaba en curso
- **THEN** el sistema cancela la locución previa antes de iniciar la nueva

#### Scenario: API no disponible
- **WHEN** `'speechSynthesis' in window` es `false`
- **THEN** el sistema NO lanza error
- **AND** la app continúa funcionando sin voz

### Requirement: Toggle de voz persistente
El sistema SHALL exponer un toggle "VOZ ON/OFF" en el topbar cuyo estado persiste junto al resto del estado de la partida.

#### Scenario: Toggle ON inicial por defecto
- **WHEN** la app arranca por primera vez sin estado guardado
- **THEN** la voz está activada (`voiceOn = true`)

#### Scenario: Alternar voz
- **WHEN** el usuario pulsa el toggle "VOZ"
- **THEN** el estado `voiceOn` se invierte
- **AND** el indicador visual cambia (dot verde lima cuando ON, atenuado cuando OFF)
- **AND** el nuevo valor se persiste en `localStorage`

#### Scenario: Restauración del toggle
- **WHEN** la app carga con estado guardado que incluye `voiceOn`
- **THEN** el toggle refleja el valor guardado

### Requirement: Pre-carga de voces del navegador
El sistema SHALL solicitar la lista de voces disponibles al montar la app y al disparar `voiceschanged`, para garantizar que la voz en español esté disponible cuando se cante el primer número.

#### Scenario: Voces no cargadas al inicio
- **WHEN** la app monta y `getVoices()` devuelve lista vacía
- **THEN** el sistema registra un handler en `onvoiceschanged` que vuelve a llamar `getVoices()` cuando dispare

#### Scenario: Reset cancela voz
- **WHEN** el usuario confirma reiniciar partida
- **THEN** el sistema invoca `speechSynthesis.cancel()` antes de limpiar el estado
