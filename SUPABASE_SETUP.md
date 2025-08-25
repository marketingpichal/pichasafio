# Configuración de Supabase para PichaDesafío

## Error Identificado

El error "El bucket de almacenamiento 'posts' no existe" indica que falta configurar Supabase Storage.

## Pasos para Solucionar

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
VITE_SITE_URL=http://localhost:5173
```

### 2. Crear Bucket en Supabase Storage

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Storage** en el menú lateral
3. Haz clic en **"Create bucket"**
4. Configura el bucket:
   - **Name**: `posts`
   - **Public bucket**: ✅ Activado (para que las imágenes sean públicas)
   - **File size limit**: 50MB (recomendado)
   - **Allowed MIME types**: `image/*,video/*`

### 3. Configurar Políticas de Storage

En la sección **Policies** del bucket `posts`, crea estas políticas:

#### Política de SELECT (ver archivos):
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'posts');
```

#### Política de INSERT (subir archivos):
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'posts' AND 
  auth.role() = 'authenticated'
);
```

#### Política de DELETE (eliminar archivos):
```sql
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'posts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Verificar Configuración

Después de configurar todo:

1. Reinicia el servidor de desarrollo: `npm run dev`
2. Intenta crear un post con una imagen
3. Los logs en la consola del navegador te mostrarán si todo funciona correctamente

### 5. Estructura de Archivos en Storage

Los archivos se guardarán con esta estructura:
```
posts/
├── usuario-id-1/
│   ├── timestamp1.jpg
│   └── timestamp2.mp4
└── usuario-id-2/
    └── timestamp3.png
```

## Solución de Problemas

- **Error de autenticación**: Verifica que las variables de entorno estén correctas
- **Error de permisos**: Revisa las políticas RLS en la tabla `posts` y en Storage
- **Error de CORS**: Asegúrate de que tu dominio esté en la lista de orígenes permitidos en Supabase

## Contacto

Si sigues teniendo problemas, revisa los logs detallados en la consola del navegador que ahora incluyen información específica sobre cada paso del proceso.