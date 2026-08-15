# Frontend SGI-Curime

Aplicación React para el portal comunitario y la gestión administrativa de la Asociación de Desarrollo Integral de Curime.

## Requisitos

- Node.js compatible con Vite 8.
- API SGI-Curime en ejecución.
- `VITE_API_URL` configurada con el origen HTTP(S) exacto de la API.
- El backend debe incluir el origen del frontend en `CORS_ORIGINS`.

## Configuración

Crear `frontend/.env.local` a partir del contrato vacío de `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

La aplicación falla al iniciar si la variable falta o no contiene un origen HTTP(S) válido. No se deben almacenar secretos en variables `VITE_*`, porque Vite las expone al navegador.

Para desarrollo local, el backend puede utilizar:

```env
CORS_ORIGINS=http://localhost:5173
```

## Comandos

Ejecutar desde la raíz del repositorio:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
npm --prefix frontend test
npm --prefix frontend run test:watch
npm --prefix frontend run lint
npm --prefix frontend run build
```

`test` ejecuta toda la suite una vez. `test:watch` mantiene Vitest activo durante el desarrollo.

## Estructura

- `src/app`: composición, rutas, layouts y límites de autorización.
- `src/features/session`: autenticación, restauración, cierre de sesión y almacenamiento del token.
- `src/pages`: superficies asociadas a rutas.
- `src/shared/api`: contratos consumidos, cliente Fetch y errores normalizados.
- `src/shared/config`: validación de configuración de entorno.
- `src/shared/ui`: estados e iconografía SVG local reutilizable.
- `src/test`: configuración compartida de Vitest y Testing Library.

## Sesión y seguridad

- El login usa correo y contraseña contra `POST /auth/login`.
- Solo el token se conserva en `sessionStorage`; la contraseña y el perfil no se persisten.
- Cada recarga valida el token mediante `GET /auth/me`.
- Un HTTP 401 autenticado elimina la sesión local.
- El rol administrativo actual requiere el nombre exacto `Administrador` informado por el servidor.
- El cierre de sesión es local; el backend todavía no revoca tokens ni ofrece refresh tokens.
- Los recursos visuales se empaquetan localmente. El frontend no necesita Google Fonts, Material Symbols, Tailwind CDN ni imágenes remotas del prototipo.

## Alcance

Esta entrega implementa el portal estático, login, shell responsive, rutas, estados, sesión y API base. Afiliados, gestión completa de usuarios y dashboard con indicadores reales se incorporarán mediante cambios OpenSpec separados. Las pruebas actuales simulan el límite HTTP y no ejercitan PostgreSQL ni un navegador E2E real.
