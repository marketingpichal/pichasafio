# Pichasafio SaaS Redesign

## Objetivo

Transformar Pichasafio desde una web app de retos y contenido montada principalmente sobre frontend + Supabase hacia una **plataforma SaaS de entrenamiento íntimo guiado**, con:

- contenido propio y reusable
- rutinas configurables
- programas premium
- monetización recurrente
- backend NestJS como capa de negocio
- Supabase conservado como infraestructura de datos base

---

## Decisión estratégica principal

La evolución correcta no es seguir agregando videos, retos o gamificación directamente desde el frontend.

La evolución correcta es construir:

**un producto SaaS de contenido modular + rutinas personalizadas + seguimiento + suscripción**

---

## Nuevo posicionamiento del producto

Pichasafio debe dejar de sentirse como:
- una landing con retos
- una biblioteca dispersa de ejercicios
- una app de contenido semi-social

Y pasar a sentirse como:
- una plataforma guiada de entrenamiento íntimo
- un sistema de progresión por programas
- una suscripción con contenido premium propio
- una experiencia personalizada por objetivo, nivel y constancia

---

## Problemas del estado actual

## Producto
- el contenido no está modelado como sistema reusable
- el reto de 30 días está demasiado acoplado a componentes específicos
- no existe motor fuerte de programas, rutinas y ejercicios
- hay mezcla de comunidad, feed, retos, rewards y utilidades sin ownership claro
- la monetización no es el centro del sistema

## Arquitectura
- mucha lógica crítica vive en frontend
- Supabase se usa casi como backend directo desde cliente
- no hay API propia que centralice negocio
- el modelo actual dificulta reglas premium, recomendaciones y evolución del producto
- el contenido externo dificulta marca propia y escalabilidad real

---

## Tesis técnica

La mejor arquitectura para la siguiente etapa es:

### Frontend
- React + Vite actual, evolucionable a app web premium

### Backend
- **NestJS** como API y capa de negocio

### Datos/Auth/Storage
- **Supabase** como:
  - PostgreSQL principal
  - Auth
  - Storage
  - opcionalmente Realtime en algunos módulos

### Regla de arquitectura
El frontend deja de hablar directamente con la mayor parte de la lógica de negocio en Supabase.
El frontend pasa a consumir principalmente **NestJS**.

Supabase queda como infraestructura, no como el lugar donde vive toda la aplicación.

---

## Módulos SaaS objetivo

## 1. Identity & Access
- usuarios
- perfiles
- auth vía Supabase
- sesiones y permisos gestionados por backend

## 2. Content Engine
- ejercicios
- variantes
- instrucciones
- advertencias
- assets multimedia
- categorías
- objetivos
- dificultad

## 3. Routine Engine
- rutinas
- pasos de rutina
- calendarios
- programas
- días de programa
- asignación de rutinas al usuario

## 4. Progress Engine
- sesiones completadas
- cumplimiento diario
- streaks
- milestones
- progreso histórico
- adherencia

## 5. Recommendation Engine
- onboarding
- objetivo del usuario
- nivel
- tiempo disponible
- sugerencia de programa/rutina

## 6. Billing & Entitlements
- planes
- suscripciones
- acceso premium
- trial
- promociones
- control de acceso por contenido

## 7. Community (opcional / no core MVP)
- posts
- comentarios
- likes
- leaderboard
- achievements

---

## Decisión importante de foco

Para construir un SaaS que facture, el orden de prioridad debe ser:

1. contenido propio
2. programas y rutinas
3. progreso
4. suscripción
5. comunidad y gamificación

Hoy el producto tiene más madura la parte social/gamificada que la parte de contenido/negocio.
Eso debe invertirse.

---

## Resultado esperado

El usuario debe poder:
- entrar
- hacer onboarding
- recibir un programa recomendado
- ver su rutina del día
- consumir contenido propio premium
- registrar avance
- mantener continuidad
- pagar por seguir o desbloquear más programas

Eso es el centro del SaaS.
