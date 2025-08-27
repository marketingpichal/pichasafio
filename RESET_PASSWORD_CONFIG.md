# Configuración de Reset Password para Localhost

## Problema Identificado

**CONFIRMADO**: El reset password no funciona en localhost porque Supabase está enviando el redirect a `https://pichasafio.com` en lugar de `http://localhost:5174`.

**URL actual del email**: `https://bgatojqxxrhdygzsrpvx.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=https://pichasafio.com`

**URL esperada**: `https://bgatojqxxrhdygzsrpvx.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=http://localhost:5174/reset-password`

Esto confirma que el problema está en la configuración del **Site URL** en el dashboard de Supabase.

## Solución: Configurar Supabase Dashboard

### 1. Acceder al Dashboard de Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto: `bgatojqxxrhdygzsrpvx`
3. Ve a **Authentication** → **Settings**

### 2. Configurar Site URL

En la sección **Site URL**:
```
Site URL: http://localhost:5174
```

### 3. Configurar Redirect URLs

En la sección **Redirect URLs**, agrega estas URLs (una por línea):
```
http://localhost:5174/**
http://localhost:5173/**
http://localhost:5174/reset-password
http://localhost:5174/auth/callback
https://pichasafio.com/**
```

### 4. Configurar Email Templates (Opcional)

En **Authentication** → **Email Templates** → **Reset Password**:

- Asegúrate de que el template esté habilitado
- Verifica que la URL de redirect en el template sea correcta
- El template debería usar: `{{ .SiteURL }}/reset-password?access_token={{ .TokenHash }}&type=recovery`

## Solución Inmediata para Testing

### Opción A: Modificar manualmente la URL del email

Cuando recibas el email de reset password:

1. **URL original**: `https://bgatojqxxrhdygzsrpvx.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=https://pichasafio.com`

2. **Cambiar manualmente a**: `https://bgatojqxxrhdygzsrpvx.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=http://localhost:5174/reset-password`

3. Pegar la URL modificada en tu navegador

### Opción B: Configurar Site URL en Supabase (Recomendado)

Sigue las instrucciones de configuración abajo para una solución permanente.

## Cómo Probar

### Opción 1: Usar el Debug Component

1. Ve a: `http://localhost:5174/debug-reset-password`
2. Ingresa un email válido
3. Haz clic en "Enviar Reset Password"
4. Revisa la consola del navegador para logs detallados
5. Revisa tu email para el enlace de reset
6. Haz clic en el enlace del email
7. Deberías ser redirigido a `/reset-password` con los tokens en la URL

### Opción 2: Usar el Login Normal

1. Ve a: `http://localhost:5174/login`
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu email
4. Haz clic en "Enviar Enlace de Recuperación"
5. Revisa tu email y haz clic en el enlace

## Verificar que Funciona

Cuando el reset password funcione correctamente:

1. El enlace del email te redirigirá a: `http://localhost:5174/reset-password?access_token=...&refresh_token=...&type=recovery`
2. La página mostrará el formulario para cambiar la contraseña
3. Los logs en la consola mostrarán que los tokens fueron encontrados
4. Podrás cambiar la contraseña exitosamente

## Troubleshooting

### Si el enlace del email no funciona:

1. Verifica que las Redirect URLs estén configuradas correctamente
2. Asegúrate de que el Site URL sea exactamente `http://localhost:5174`
3. Revisa que no haya espacios extra en las configuraciones

### Si los tokens no aparecen en la URL:

1. Verifica la configuración del email template
2. Asegúrate de que el template esté usando la URL correcta
3. Revisa los logs de Supabase en el dashboard

### Si aparece "página no encontrada":

1. Verifica que la ruta `/reset-password` esté configurada en App.tsx
2. Asegúrate de que el servidor de desarrollo esté corriendo

## Variables de Entorno Actuales

```env
VITE_SUPABASE_URL=https://bgatojqxxrhdygzsrpvx.supabase.co
VITE_SITE_URL=http://localhost:5174
```

Estas variables están correctas y coinciden con la configuración requerida.

## Componentes Modificados

- ✅ `Login/index.tsx` - Agregado reset password con debug
- ✅ `ResetPassword/index.tsx` - Manejo de tokens con debug
- ✅ `DebugResetPassword/index.tsx` - Componente de debug específico
- ✅ `App.tsx` - Rutas agregadas

## Próximos Pasos

1. **IMPORTANTE**: Configurar el dashboard de Supabase según las instrucciones arriba
2. Probar con el componente de debug: `http://localhost:5174/debug-reset-password`
3. Verificar los logs en la consola del navegador
4. Una vez que funcione, probar con el login normal

---

**Nota**: El problema principal NO está en el código, sino en la configuración del dashboard de Supabase. Una vez configurado correctamente, el reset password funcionará perfectamente.