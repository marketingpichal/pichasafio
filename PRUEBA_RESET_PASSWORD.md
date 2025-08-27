# 🔧 Guía Paso a Paso: Probar Reset Password en Localhost

## ⚠️ Problema Identificado

El formulario no aparece porque Supabase está enviando la URL con `redirect_to=https://pichasafio.com` en lugar de `redirect_to=http://localhost:5174/reset-password`.

## 🚀 Solución Inmediata (Funciona AHORA)

### Paso 1: Obtener el Email de Reset
1. Ve a `http://localhost:5174/login`
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu email y envía
4. Revisa tu email

### Paso 2: Modificar la URL del Email

Cuando recibas el email, verás una URL como esta:
```
https://bgatojqxxrhdygzsrpvx.supabase.co/auth/v1/verify?token=XXXXX&type=recovery&redirect_to=https://pichasafio.com
```

**CAMBIA** la parte final:
- ❌ `redirect_to=https://pichasafio.com`
- ✅ `redirect_to=http://localhost:5174/reset-password`

### Paso 3: URL Corregida

La URL final debe verse así:
```
https://bgatojqxxrhdygzsrpvx.supabase.co/auth/v1/verify?token=XXXXX&type=recovery&redirect_to=http://localhost:5174/reset-password
```

### Paso 4: Probar
1. Copia la URL corregida
2. Pégala en tu navegador
3. ¡Deberías ver el formulario de cambio de contraseña!

## 🧪 Herramienta de Debug

Si necesitas más información de debug:
1. Ve a `http://localhost:5174/debug-reset-password`
2. Ingresa tu email
3. Envía el reset
4. Usa el botón "Check URL Parameters" para ver qué parámetros llegan

## ✅ Resultado Esperado

Cuando uses la URL corregida deberías ver:
- ✅ Formulario con campos "Nueva contraseña" y "Confirmar contraseña"
- ✅ Botón "Actualizar contraseña"
- ✅ Mensaje de éxito al cambiar la contraseña
- ✅ Redirección automática al login

## 🔧 Solución Permanente

Para que funcione automáticamente sin modificar URLs:
1. Ve al dashboard de Supabase
2. Authentication → Settings
3. Cambia **Site URL** a: `http://localhost:5174`
4. Agrega en **Redirect URLs**: `http://localhost:5174/**`

---

**💡 Tip**: El problema es de configuración de Supabase, no del código. La funcionalidad está implementada correctamente.