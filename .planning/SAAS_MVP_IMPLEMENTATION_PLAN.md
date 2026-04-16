# SAAS_MVP_IMPLEMENTATION_PLAN

## Objetivo del MVP

Entregar una primera versión de Pichasafio como SaaS que permita:
- registro/login
- onboarding inicial
- acceso a contenido propio
- programa guiado
- rutinas diarias
- tracking de progreso
- base lista para monetización premium

---

## Fase 01 - Foundation & Backend

### Entregables
- backend NestJS creado
- conexión a Supabase Postgres mediante Prisma
- auth JWT de Supabase validado en backend
- estructura modular base
- contratos API iniciales

### Resultado
El frontend deja de ser el único lugar donde vive la lógica de negocio.

---

## Fase 02 - Domain & Data Model

### Entregables
- tablas/modelos nuevas para:
  - exercises
  - media_assets
  - routines
  - routine_steps
  - programs
  - program_days
  - user_assessments
  - user_programs
  - user_sessions
- estrategia de migración desde `user_challenges` y `daily_progress`

### Resultado
El contenido y las rutinas pasan a ser sistema reusable.

---

## Fase 03 - Content Admin

### Entregables
- panel interno o endpoints admin para:
  - crear ejercicios
  - subir assets
  - crear rutinas
  - crear programas
  - asignar días y pasos

### Resultado
Empiezas a producir contenido propio y estructurado.

---

## Fase 04 - User Onboarding & Program Assignment

### Entregables
- onboarding con:
  - nivel
  - objetivo
  - tiempo disponible
  - experiencia
- recomendación simple de programa
- asignación automática del programa inicial

### Resultado
La app deja de ser catálogo y se vuelve guiada.

---

## Fase 05 - Daily Routine Experience

### Entregables
- vista “mi rutina de hoy”
- pasos de rutina
- reproducción de media propia
- marcar sesión como completada
- feedback y continuidad

### Resultado
Se activa el loop principal del SaaS.

---

## Fase 06 - Progress & Premium

### Entregables
- dashboard de progreso
- streaks y continuidad
- gating premium
- planes y entitlements base

### Resultado
Ya existe núcleo monetizable.

---

## Qué reutilizar del sistema actual

## Reusar
- auth actual con Supabase
- perfiles
- parte de leaderboard/rewards si luego suma al engagement
- shell frontend y componentes reutilizables

## Refactorizar
- challengeService
- progress model actual
- rutas de rutinas y challenge 30 días
- acceso directo a Supabase desde cliente para negocio crítico

## Sacar del camino por ahora
- complejidad social no esencial
- features accesorias sin impacto en conversión o retención

---

## Prioridad de implementación

1. backend NestJS
2. modelo de contenido
3. programa de 30 días reescrito sobre nuevo dominio
4. progreso y sesiones
5. monetización
6. comunidad y gamificación extendida

---

## Primera iteración técnica recomendada

### Sprint 1
- crear `apps/api`
- configurar NestJS + Prisma
- conectar Supabase Postgres
- validar JWT Supabase
- exponer `/me`
- exponer `/programs`
- exponer `/progress/summary`

### Sprint 2
- crear modelos `Exercise`, `Routine`, `Program`, `UserProgram`, `UserSession`
- poblar primer programa oficial de 30 días con contenido propio

### Sprint 3
- conectar frontend al backend para onboarding, programas y progreso

---

## Meta de negocio del MVP

No es “tener más pantallas”.
La meta es:

**que un usuario pueda entrar, empezar un programa, volver cada día y tener una razón clara para pagar.**
