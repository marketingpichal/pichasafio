# SAAS_DOMAIN_MAP

## Centro del dominio

El nuevo centro del producto debe ser:

`User + Exercise + Routine + Program + Session + Subscription`

No debe ser:
- el reto hardcoded de 30 días
- el leaderboard
- el feed
- videos sueltos

---

## Bounded contexts

## A. Identity
### Responsabilidad
Gestionar autenticación, perfil y acceso.

### Entidades
- `User`
- `UserProfile`
- `UserAssessment`
- `UserGoal`

### Notas
- Auth puede seguir viviendo en Supabase Auth.
- El backend NestJS debe centralizar lectura/escritura de negocio y validaciones.

---

## B. Content Engine
### Responsabilidad
Modelar el contenido propio reusable.

### Entidades
- `Exercise`
- `ExerciseVariant`
- `Instruction`
- `Contraindication`
- `MediaAsset`
- `Category`
- `Goal`
- `DifficultyLevel`

### Notas
Cada ejercicio debe ser reusable en múltiples rutinas y programas.

---

## C. Routine Engine
### Responsabilidad
Definir combinaciones concretas de ejercicios.

### Entidades
- `Routine`
- `RoutineStep`
- `RoutineBlock`
- `RoutineTag`

### Notas
Las rutinas son piezas reutilizables. No deben vivir incrustadas en componentes frontend.

---

## D. Program Engine
### Responsabilidad
Construir experiencias de varios días/semanas.

### Entidades
- `Program`
- `ProgramDay`
- `ProgramAssignment`
- `ProgramMilestone`

### Notas
El actual challenge de 30 días debería migrar a este contexto.

---

## E. Progress Engine
### Responsabilidad
Registrar lo que el usuario realmente hizo.

### Entidades
- `UserSession`
- `SessionExerciseLog`
- `CompletionLog`
- `Streak`
- `ProgressMetric`
- `MilestoneEvent`

### Notas
Aquí vive la verdad del progreso, no en hacks de UI ni en contadores sueltos.

---

## F. Recommendation Engine
### Responsabilidad
Asignar y ajustar programas.

### Entidades
- `RecommendationProfile`
- `ProgramRecommendation`
- `AdaptationRule`

### Notas
Puede arrancar simple con reglas, no IA.

---

## G. Billing & Access
### Responsabilidad
Monetización y control de acceso.

### Entidades
- `SubscriptionPlan`
- `Subscription`
- `Payment`
- `Entitlement`
- `PromoCode`

### Notas
Sin este contexto no hay SaaS real, solo app de contenido.

---

## H. Community (opcional)
### Responsabilidad
Capas de engagement no core.

### Entidades
- `Post`
- `Comment`
- `Like`
- `Leaderboard`
- `Achievement`
- `Reward`

### Notas
Esto debe quedar desacoplado del core premium.

---

## Mapa actual → target

## Conservar con adaptación
- `profiles`
- `user_challenges`
- `daily_progress`
- `leaderboard`
- `posts`
- `post_comments`
- `post_likes`

## Reinterpretar
- `user_challenges` → `ProgramAssignment`
- `daily_progress` → `UserSession` / `CompletionLog`
- `leaderboard` → módulo opcional de community/gamification

## Crear nuevo
- `exercises`
- `exercise_media_assets`
- `routines`
- `routine_steps`
- `programs`
- `program_days`
- `user_assessments`
- `user_programs`
- `user_sessions`
- `subscription_plans`
- `subscriptions`
- `entitlements`

---

## Decisión estructural

El feed y la gamificación no pueden seguir dictando el dominio.
El dominio debe ser liderado por:
- contenido propio
- rutinas
- programas
- progreso
- suscripción
