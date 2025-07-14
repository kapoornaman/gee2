// server/index.ts
import express2 from "express";
const app = express2();

// ... all your existing middleware, routes, and logic ...

export default app; // ✅ Key for Vercel Serverless Function

// Only start the server if not on Vercel
if (!process.env.VERCEL) {
  (async () => {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = 5000;
    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      log(`serving on port ${port}`);
    });
  })();
}
