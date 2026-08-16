# Backend SGI-Curime

API REST del Sistema de Gestion Integral para la Asociacion de Desarrollo Integral de Curime.

## Requisitos

- Node.js compatible con NestJS 11 y Prisma 7. La verificacion actual usa Node.js `v24.18.0` y npm `11.16.0`.
- PostgreSQL disponible para ejecutar la API y las pruebas que dependan de persistencia.
- Un archivo `backend/.env` local. No se deben poner credenciales en `backend/.env.example`.

## Configuracion

Crear `backend/.env` a partir de `.env.example` y completar los valores locales:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
CORS_ORIGINS=http://localhost:5173
ADMIN_NAME=
ADMIN_IDENTIFICATION=
ADMIN_EMAIL=
ADMIN_PASSWORD=
JWT_SECRET=
JWT_EXPIRES_IN=1h
ACTIVATION_TOKEN_TTL_HOURS=24
```

`CORS_ORIGINS` debe contener origenes HTTP(S) exactos y separados por coma cuando se necesiten varios. `JWT_SECRET`, contrasenas y credenciales de base de datos son valores locales y no deben versionarse.

## Docker local

Desde la raiz del repositorio, crear el archivo `.env` a partir de `.env.example` y completar los valores requeridos. Luego iniciar el stack:

```powershell
Copy-Item .env.example .env
docker compose build
docker compose up -d
docker compose exec backend npm run db:migrate:deploy
docker compose logs -f backend
docker compose down
```

Dentro de Compose, el backend usa PostgreSQL mediante el host `postgres`; el navegador usa `VITE_API_URL=http://localhost:3000`. PostgreSQL conserva los datos en un volumen nombrado. `docker compose down -v` es destructivo para ese volumen y no forma parte del flujo normal.

## Comandos

Ejecutar desde la raiz del repositorio:

```powershell
npm --prefix backend ci
npm --prefix backend run start:dev
npm --prefix backend run build
npm --prefix backend run lint
npm --prefix backend test
npm --prefix backend run test:e2e
npm --prefix backend run db:migrate:deploy
npm --prefix backend run db:seed
```

`lint` usa ESLint con `--fix`, por lo que se debe revisar el diff despues de ejecutarlo. `db:migrate:deploy` aplica solo migraciones versionadas. `db:seed` modifica la base de datos configurada y requiere todos los valores del administrador inicial.

## Estructura actual

- `src/auth`: login, JWT, activacion de cuentas y guards de roles.
- `src/users`: consulta y administracion de usuarios.
- `src/user-requests`: solicitudes de cuenta y activacion.
- `src/prisma`: modulo global de acceso a Prisma.
- `prisma/`: esquema, migraciones y seed.
- `test/`: pruebas E2E.

Los controladores delegan en servicios y la persistencia usa PostgreSQL mediante Prisma. La separacion en capas de Clean Architecture se introducira de forma incremental; no se debe crear una reestructuracion general como parte de la fundacion actual.

## Verificacion

```powershell
npm --prefix backend run build
npm --prefix backend test
npm --prefix backend run lint
```

Las pruebas unitarias actuales cubren autenticacion, usuarios, solicitudes de usuario, configuracion CORS y el controlador principal. La cobertura de PostgreSQL depende de una base configurada y no se sustituye por valores de ejemplo.

En la verificacion de la fundacion, las 47 pruebas, el build y ESLint pasan. La integracion continua repite estas verificaciones con PostgreSQL disponible.
