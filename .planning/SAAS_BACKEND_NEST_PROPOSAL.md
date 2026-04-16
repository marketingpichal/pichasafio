# SAAS_BACKEND_NEST_PROPOSAL

## Objetivo

Introducir un backend en NestJS para que Pichasafio deje de depender de lógica de negocio dispersa en el frontend y pueda evolucionar a SaaS sin abandonar Supabase como base de datos.

---

## Arquitectura objetivo

## Frontend
- React + Vite
- consume API propia de NestJS
- solo usa Supabase Auth cliente donde convenga la sesión inicial

## Backend
- NestJS
- capa de negocio principal
- validación de reglas
- control de acceso premium
- recomendación de programas
- endpoints de progreso, contenido y suscripción

## Infraestructura de datos
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage

---

## Principio clave

**Supabase sigue siendo la base de datos, pero NestJS se vuelve el backend real del producto.**

Eso permite:
- centralizar lógica
- evitar lógica sensible en cliente
- controlar monetización
- preparar app mobile/API pública futura
- escalar hacia más módulos sin caos

---

## Propuesta de estructura técnica

## Monorepo recomendado

```text
/apps
  /web        -> frontend actual React/Vite
  /api        -> nuevo backend NestJS
/packages
  /shared     -> tipos, contratos, utils comunes
```

Si no quieres monorepo de una vez, al menos:

```text
/pichasafio        -> frontend actual
/pichasafio-api    -> nuevo backend NestJS
```

Mi recomendación: monorepo simple si se puede.

---

## Módulos iniciales de NestJS

## 1. AuthModule
Responsabilidad:
- validar JWT de Supabase
- resolver usuario autenticado
- guards

## 2. UsersModule
Responsabilidad:
- perfil
- onboarding
- evaluación inicial
- preferencias

## 3. ContentModule
Responsabilidad:
- ejercicios
- assets
- categorías
- objetivos
- dificultad

## 4. RoutinesModule
Responsabilidad:
- rutinas
- pasos
- filtros
- asignación

## 5. ProgramsModule
Responsabilidad:
- programas
- días
- progreso por programa
- challenge de 30 días migrado

## 6. ProgressModule
Responsabilidad:
- registrar sesiones
- cumplimiento diario
- streaks
- historial

## 7. BillingModule
Responsabilidad:
- planes
- suscripciones
- entitlements
- premium access

## 8. CommunityModule (después)
Responsabilidad:
- feed
- comentarios
- likes
- rewards
- leaderboard

---

## Conexión con Supabase

## Opción recomendada
NestJS se conecta directamente a Postgres usando ORM.

### Recomendación ORM
- **Prisma**

### ¿Por qué?
- tipado fuerte
- migraciones más ordenadas
- mejor DX para reorganizar dominio
- ideal si vienes de rediseño estructural

NestJS también puede usar el SDK de Supabase en casos puntuales para:
- verificar auth tokens
- firmar URLs de Storage
- manejar algunos flujos específicos

Pero el acceso principal al modelo de negocio debería ser por ORM al Postgres.

---

## Auth strategy

## Mantener
- Supabase Auth

## Agregar
- NestJS guard que valide el JWT emitido por Supabase
- decorador `CurrentUser`
- capa de autorización por plan/entitlements

### Resultado
El usuario se loguea como hoy, pero el backend NestJS toma control de la lógica protegida.

---

## Storage strategy

Seguir usando Supabase Storage o Cloudinary según tipo de asset.

### Recomendación
- videos premium y contenido estructurado: preferir estrategia clara única
- si Cloudinary ya está funcionando bien para media pública, puede quedarse
- si quieres simplificar operación, centralizar más en Supabase Storage

No mezclar arbitrariamente ambos sin una política clara.

---

## Fases de implementación backend

## Fase 1
Crear backend base:
- NestJS app
- Prisma
- conexión a Supabase Postgres
- validación de JWT Supabase
- módulos base `Auth`, `Users`, `Programs`, `Progress`

## Fase 2
Modelar core nuevo:
- exercises
- routines
- programs
- user_programs
- user_sessions

## Fase 3
Migrar challenge actual de 30 días al nuevo dominio.

## Fase 4
Mover frontend a consumir NestJS en:
- perfil
- programas
- progreso
- contenido

## Fase 5
Agregar billing/entitlements.

---

## Qué NO haría
- no dejaría toda la lógica premium en el frontend
- no seguiría metiendo reglas en `challengeService.ts`
- no construiría primero comunidad o más gamificación
- no intentaría rehacer todo el frontend antes de tener backend y dominio claros

---

## Primera meta técnica realista

La primera meta correcta es:

**poner a correr `apps/api` con NestJS + Prisma + Supabase Postgres + auth guard de Supabase**

Y luego implementar los primeros endpoints:
- `GET /me`
- `PATCH /me/profile`
- `GET /programs`
- `GET /programs/:id`
- `POST /programs/:id/start`
- `POST /sessions/complete`
- `GET /progress/summary`

Con eso ya empiezas a sacar negocio del frontend.
