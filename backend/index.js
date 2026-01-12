import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { pool } from "./db.js";
import documentsRoutes from "./routes/documents.routes.js";


pool.query("SELECT 1")
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.error("❌ DB error", err));
  
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});


app.listen(8000, () =>
  console.log("Backend running on http://localhost:8000")
);
