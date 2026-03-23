## 1. Dockerfile - Declaración de volumen

- [x] 1.1 Añadir instrucción `VOLUME /app/data` en el Dockerfile antes de la línea `USER nextjs`

## 2. Entrypoint - Detección de volumen y diagnóstico

- [x] 2.1 Añadir verificación en `entrypoint.sh` que detecte si `/app/data` es un volumen montado real o filesystem efímero, usando comparación de device IDs con el filesystem raíz
- [x] 2.2 Añadir log informativo que indique si se encontró una base de datos existente (`data.db`) o si es primera ejecución

## 3. Documentación - Guía de despliegue en Coolify

- [x] 3.1 Añadir sección en README.md con instrucciones paso a paso para configurar volúmenes persistentes en Coolify
- [x] 3.2 Incluir troubleshooting de permisos (UID 1001) y verificación de persistencia

## 4. Verificación

- [x] 4.1 Construir imagen Docker localmente y verificar que el `VOLUME` está declarado (`docker inspect`)
- [x] 4.2 Probar entrypoint con y sin volumen montado para verificar los mensajes de diagnóstico
