import express from 'express';

export function createHealthRouter(db) {
  const router = express.Router();

  // GET /api/health — System Health & Runtime Diagnostics
  router.get('/', async (req, res) => {
    const memory = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    const healthInfo = {
      status: 'healthy',
      service: 'Digital Life Lessons API Server',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptimeSeconds / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
      uptimeSeconds: Math.floor(uptimeSeconds),
      nodeVersion: process.version,
      database: db ? 'connected' : 'disconnected',
      memory: {
        rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`
      }
    };

    res.json(healthInfo);
  });

  return router;
}
