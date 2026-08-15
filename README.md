# SGI-Curime

Sistema de Gestión Integral para la Asociación de Desarrollo Integral de Curime.

## Descripción

SGI-Curime es una aplicación web desarrollada para apoyar la gestión administrativa y comunitaria de la Asociación de Desarrollo Integral de Curime.

El sistema busca centralizar y digitalizar procesos que actualmente se realizan de forma manual o mediante diferentes medios, facilitando el control de la información, la trazabilidad de los procesos y la generación de reportes.

## Tecnologías

### Frontend
- React
- TypeScript

### Backend
- Node.js
- NestJS

### Base de datos
- PostgreSQL

### ORM
- Prisma

### Autenticación
- JWT
- Roles y permisos

### Control de versiones
- Git
- GitHub

## Módulos del sistema

1. Administrativo
2. Usuarios
3. Financiero
4. Reportes y Estadísticas
5. Reservas
6. Emprendimiento
7. Voluntariado
8. Inventario
9. Donaciones

## Desarrollo actual

Actualmente el desarrollo se encuentra enfocado en:

- Módulo de Usuarios
- Módulo Administrativo

La fundacion actual tambien incluye el portal frontend, sus rutas publicas, login, restauracion de sesion y shells responsivos. La gestion completa de usuarios, los dashboards con indicadores reales y los modulos de negocio restantes siguen pendientes.

## Equipo

- Dauren Matarrita
- Matias Farrier
- Jesus Matarrita
- Daniel Marchena

## Estructura del proyecto

SGI-Curime se divide inicialmente en dos aplicaciones:

- `frontend/`: aplicación web desarrollada con React y TypeScript.
- `backend/`: API desarrollada con NestJS.

La base de datos PostgreSQL será utilizada por el backend mediante Prisma.

## Desarrollo local

El repositorio contiene dos aplicaciones npm independientes, cada una con su propio `package.json` y lockfile. Ejecuta los comandos desde la raiz:

```powershell
npm --prefix frontend ci
npm --prefix frontend run dev
npm --prefix frontend test
npm --prefix frontend run lint
npm --prefix frontend run build

npm --prefix backend ci
npm --prefix backend run start:dev
npm --prefix backend test
npm --prefix backend run lint
npm --prefix backend run build
```

Node.js `v24.18.0` y npm `11.16.0` fueron usados para la verificacion actual. El proyecto no incluye aun un archivo de version como `.nvmrc`. Docker, CI y la infraestructura local reproducible son fases posteriores y no deben considerarse disponibles por este documento.

Los valores locales se configuran en `frontend/.env.local` y `backend/.env`; los archivos `.env.example` son contratos sin secretos.

## Documentacion del avance

- [Fundacion integrada del frontend](docs/frontend-foundation-progress.md): alcance implementado, rutas, configuracion, verificaciones, limitaciones y siguientes fases.
