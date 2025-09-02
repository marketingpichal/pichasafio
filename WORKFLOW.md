# Workflow de Desarrollo - Pichasafio

Este documento describe el workflow de desarrollo implementado para manejar entornos separados de desarrollo y producción.

## 🏗️ Estructura de Entornos

### Desarrollo
- **Base de datos**: `ghghxoxvyvztddeorhed.supabase.co`
- **Puerto local**: `3001`
- **Archivo de configuración**: `.env.development`
- **Rama Git**: `develop`

### Producción
- **Base de datos**: Tu proyecto de producción
- **Puerto local**: `3000`
- **Archivo de configuración**: `.env.production`
- **Rama Git**: `main`

## 📁 Archivos de Configuración

### `.env.development`
Contiene las credenciales de desarrollo (ya configurado):
```env
VITE_SUPABASE_URL=https://ghghxoxvyvztddeorhed.supabase.co
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### `.env.production`
Debes crear este archivo basándote en `.env.production.example` con tus credenciales de producción.

## 🚀 Scripts Disponibles

### Desarrollo
```bash
# Iniciar en modo desarrollo (puerto 3001)
npm run dev

# Verificar configuración de entorno
npm run env:check

# Construir para desarrollo
npm run build:dev
```

### Producción
```bash
# Iniciar en modo producción (puerto 3000)
npm run dev:prod

# Construir para producción
npm run build
```

### Migraciones
```bash
# Ejecutar migración en desarrollo
npm run migrate:dev ./sql/mi-migracion.sql

# Ejecutar migración en producción
npm run migrate:prod ./sql/mi-migracion.sql

# O usar directamente:
node scripts/migrate.js development ./sql/mi-migracion.sql
node scripts/migrate.js production ./sql/mi-migracion.sql
```

### Sincronización de Entornos
```bash
# Comparar esquemas entre entornos
npm run sync:compare

# Exportar esquema de desarrollo
npm run sync:export:dev

# Exportar esquema de producción
npm run sync:export:prod

# Sincronizar desarrollo a producción (con confirmación)
npm run sync:dev-to-prod
```

## 🔄 Workflow de Desarrollo

### 1. Desarrollo Local
```bash
# Cambiar a rama develop
git checkout develop

# Iniciar servidor de desarrollo
npm run dev

# La app usará automáticamente .env.development
# Puerto: http://localhost:3001
```

### 2. Hacer Cambios en Base de Datos
```bash
# Crear archivo de migración
echo "ALTER TABLE users ADD COLUMN new_field TEXT;" > sql/001_add_new_field.sql

# Ejecutar en desarrollo
npm run migrate:dev ./sql/001_add_new_field.sql

# Probar cambios localmente
npm run dev
```

### 3. Comparar Entornos
```bash
# Ver diferencias entre desarrollo y producción
npm run sync:compare
```

### 4. Preparar para Producción
```bash
# Exportar esquema de desarrollo
npm run sync:export:dev

# Revisar el archivo schema-dev.sql generado
# Hacer commit de cambios
git add .
git commit -m "feat: add new field to users table"
git push origin develop
```

### 5. Deploy a Producción
```bash
# Cambiar a main
git checkout main
git merge develop

# Aplicar migración a producción
npm run migrate:prod ./sql/001_add_new_field.sql

# Verificar que todo funcione
npm run dev:prod

# Deploy
git push origin main
```

## 📂 Estructura de Archivos

```
pichasafio/
├── .env.development          # Configuración de desarrollo
├── .env.production          # Configuración de producción (crear)
├── .env.production.example  # Plantilla para producción
├── src/
│   ├── lib/
│   │   ├── config.ts        # Configuración centralizada
│   │   └── supabaseClient.tsx # Cliente de Supabase
├── scripts/
│   ├── migrate.js           # Script de migraciones
│   └── sync-environments.js # Script de sincronización
├── sql/                     # Archivos de migración
│   └── *.sql
└── WORKFLOW.md             # Esta documentación
```

## 🛠️ Scripts de Utilidad

### migrate.js
Ejecuta migraciones SQL en cualquier entorno:
```bash
node scripts/migrate.js <entorno> <archivo-sql>
```

### sync-environments.js
Sincroniza esquemas entre entornos:
```bash
# Comparar
node scripts/sync-environments.js compare

# Exportar
node scripts/sync-environments.js export development schema.sql

# Sincronizar
node scripts/sync-environments.js sync development production
```

## ⚠️ Consideraciones de Seguridad

1. **Nunca commitear archivos .env**: Están en .gitignore
2. **Confirmar antes de producción**: Los scripts piden confirmación
3. **Backup antes de migraciones**: Especialmente en producción
4. **Revisar cambios**: Siempre revisar archivos SQL antes de aplicar

## 🔍 Troubleshooting

### Error: "Configuración incompleta"
- Verifica que existan los archivos .env correspondientes
- Verifica que las variables estén definidas correctamente

### Error: "Puerto en uso"
- Desarrollo usa puerto 3001
- Producción usa puerto 3000
- Verifica que no haya otros procesos usando estos puertos

### Error en migraciones
- Verifica la sintaxis SQL
- Verifica permisos en la base de datos
- Revisa los logs del script

## 📝 Buenas Prácticas

1. **Siempre probar en desarrollo primero**
2. **Hacer commits pequeños y frecuentes**
3. **Documentar cambios en migraciones**
4. **Hacer backup antes de cambios importantes**
5. **Revisar comparaciones de entornos regularmente**
6. **Usar nombres descriptivos para archivos de migración**

## 🎯 Próximos Pasos

1. Configurar tu archivo `.env.production`
2. Crear tu primera migración de prueba
3. Probar el workflow completo
4. Configurar CI/CD si es necesario

---

¿Necesitas ayuda? Revisa los logs de los scripts o contacta al equipo de desarrollo.