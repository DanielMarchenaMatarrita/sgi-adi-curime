# Avance de la fundacion frontend

## Alcance implementado

La fundacion frontend actual usa React, TypeScript, Vite y React Router en una aplicacion independiente dentro de `frontend/`. Incluye:

- Portal publico y landing page.
- Login por correo y contrasena contra `POST /auth/login`.
- Restauracion de sesion mediante `GET /auth/me`.
- Almacenamiento del access token solamente en `sessionStorage`.
- Invalidacion local de sesion ante respuestas autenticadas HTTP 401.
- Cliente Fetch centralizado y contratos de respuesta compartidos.
- Shell publico y shell administrativo responsive.
- Estados de carga, error, prohibido y no encontrado.
- Iconos SVG locales y tipografia Inter empaquetada localmente.
- Pruebas Vitest con jsdom y Testing Library.

## Rutas actuales

| Ruta | Acceso | Proposito |
| --- | --- | --- |
| `/` | Publico | Portal comunitario |
| `/solicitar-cuenta` | Publico | Solicitud de cuenta |
| `/activar-cuenta` | Publico | Activacion de cuenta |
| `/iniciar-sesion` | Invitado | Inicio de sesion |
| `/app` | Autenticado | Inicio administrativo |
| `/admin` | Rol `Administrador` | Area administrativa |
| `/403` | Autenticado | Acceso prohibido |

## Limitaciones conocidas

- El cierre de sesion es local; el backend aun no revoca tokens ni ofrece refresh tokens.
- La autorizacion administrativa depende actualmente del nombre exacto de rol `Administrador`.
- La gestion completa de usuarios, afiliados y dashboards con datos reales no forma parte de esta fundacion.
- Las pruebas actuales simulan el limite HTTP; no ejercitan PostgreSQL ni un navegador E2E real.
- El stack Docker local y la CI ya estan definidos; la cobertura de navegador E2E real y el despliegue productivo siguen fuera de esta fundacion.

## Verificacion

Ejecutar desde la raiz:

```powershell
npm --prefix frontend ci
npm --prefix frontend test
npm --prefix frontend run lint
npm --prefix frontend run build
```

Resultados registrados para la fundacion actual:

- Frontend: 20 pruebas pasaron; lint y build pasaron.
- Backend: 47 pruebas pasaron, build y lint pasaron.
- Las pruebas actuales no requieren PostgreSQL para sus suites unitarias; la validacion de persistencia queda para la fase de infraestructura.

Para desarrollo local, crear `frontend/.env.local` con:

```env
VITE_API_URL=http://localhost:3000
```

Las variables `VITE_*` son visibles en el navegador y no deben contener secretos.

## Siguientes fases

1. Fundacion backend ampliada.
2. Integracion frontend adicional.
3. Autenticacion y autorizacion ampliadas.
4. Primer modulo funcional del Sprint 1.
5. Capas backend incrementales.
