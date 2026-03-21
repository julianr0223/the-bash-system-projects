## 1. Refactorizar lógica de seed en lib/db.ts

- [x] 1.1 Separar seed de usuario y seed de rutinas: extraer la creación de usuario admin en un paso que usa `INSERT OR IGNORE` o verifica existencia antes de insertar
- [x] 1.2 Agregar verificación de rutinas del admin: si el usuario admin existe pero tiene 0 rutinas, insertar las rutinas por defecto
- [x] 1.3 Obtener el `userId` del admin existente con `SELECT id FROM users WHERE email = 'admin@rutinas.local'` para usarlo en el seed de rutinas

## 2. Verificación

- [x] 2.1 Verificar que la app construye correctamente con `npm run build`
