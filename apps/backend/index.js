// backend/index.js
import 'dotenv/config';
import express from "express";

const app = express();

// your middlewares & routes
app.get("/api", (req, res) => {
  res.json({ message: "API running on Vercel 🚀" });
});

// ❌ Not allowed on Vercel
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Instead, export app for Vercel
export default app;