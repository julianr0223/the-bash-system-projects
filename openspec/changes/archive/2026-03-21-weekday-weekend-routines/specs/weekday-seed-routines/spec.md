## ADDED Requirements

### Requirement: Rutinas de trabajo seed con frecuencia weekdays
Las rutinas de trabajo en el seed (`Sesion trabajo 1`, `Sesion trabajo 2`) SHALL tener frecuencia `"weekdays"` en lugar de `"daily"`.

#### Scenario: Seed en base de datos nueva
- **WHEN** se ejecuta el seed de rutinas por defecto
- **THEN** `Sesion trabajo 1` y `Sesion trabajo 2` MUST tener frecuencia `"weekdays"`
- **AND** las demás rutinas (Kefir, Ejercicios estiramiento, Estudiar ingles, Gym, Tomar medicamento colesterol, Sesion estudio/aprendizaje, Planificar dia siguiente) MUST tener frecuencia `"daily"`

#### Scenario: Vista diaria en fin de semana
- **WHEN** el usuario abre la vista /hoy un sábado o domingo
- **THEN** las rutinas de trabajo NO MUST aparecer en la lista
- **AND** las rutinas personales (daily) MUST aparecer normalmente
