# Cuenta Regresiva — Viaje de Emi

Countdown interactivo con animación flip-clock para el viaje de Emi el **10 de diciembre de 2026**.

## Tech Stack

- **React 19** — UI
- **Vite 7** — Build tool
- **Tailwind CSS 4** — Estilos
- **Lucide React** — Iconos

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview   # para verificar el build localmente
```

Los archivos de producción se generan en `dist/`.

## Deploy en VPS

1. Clonar el repo en el servidor
2. Ejecutar `npm install && npm run build`
3. Servir la carpeta `dist/` con Nginx, Caddy, o el servidor de tu preferencia

### Ejemplo Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/al/proyecto/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
