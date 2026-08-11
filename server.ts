import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import routes from './src/server/routes.js';
import { initDatabase, getDatabase } from './src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize Persistent DB Engine & Seeds
  initDatabase();

  const app = express();
  const PORT = 3000;

  // Body Parsing Middleware (Allow up to 10mb for image uploads & Base64 previews)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser lightweight manual implementation
  app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
      cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        if (parts.length === 2) {
          cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
        }
      });
    }
    (req as any).cookies = cookies;
    next();
  });

  // Mount API Router
  app.use('/api', routes);

  // SEO XML Sitemap Route
  app.get('/sitemap.xml', (req, res) => {
    const db = getDatabase();
    const appUrl = process.env.APP_URL || 'https://trustedcars.com';
    const availableCars = db.cars.filter((c) => c.status === 'Available');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url><loc>${appUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>${appUrl}/cars</loc><changefreq>daily</changefreq><priority>0.9</priority></url>\n`;
    xml += `  <url><loc>${appUrl}/sell</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    xml += `  <url><loc>${appUrl}/finance</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;

    availableCars.forEach((car) => {
      xml += `  <url><loc>${appUrl}/cars/${car.slug}</loc><lastmod>${car.updatedAt.slice(0, 10)}</lastmod><priority>0.7</priority></url>\n`;
    });

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // SEO Robots.txt Route
  app.get('/robots.txt', (req, res) => {
    const appUrl = process.env.APP_URL || 'https://trustedcars.com';
    const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${appUrl}/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  });

  // Vite Middleware integration for dev, or static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Trusted Cars] Full-Stack Dealership Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
