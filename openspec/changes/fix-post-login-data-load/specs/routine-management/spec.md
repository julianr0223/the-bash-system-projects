## ADDED Requirements

### Requirement: Carga de datos condicionada a autenticación

El sistema SHALL iniciar las llamadas a la API de rutinas y completions únicamente después de que el usuario esté autenticado, para evitar fetches con tokens ausentes que resulten en estado vacío.

#### Scenario: Primera visita post-login sin reload

- **WHEN** un usuario se loguea exitosamente y es llevado al shell autenticado por primera vez
- **THEN** las rutinas y completions del usuario se cargan y muestran en `/hoy` sin requerir reload manual del navegador

#### Scenario: No se hacen fetches antes de autenticar

- **WHEN** la app está en estado `loading` o `login`
- **THEN** no se disparan llamadas a `/api/routines` ni a `/api/completions`

#### Scenario: Logout limpia datos en memoria

- **WHEN** el usuario hace logout
- **THEN** los arreglos de rutinas y completions cargados en memoria se descartan, de modo que un siguiente login no muestre datos stale del usuario anterior
