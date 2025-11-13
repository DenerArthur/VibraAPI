import express from "express";
import cors from "cors";
import { searchTracks, getFastAudioUrl } from "./api/youtube.js";

const app = express();
app.use(cors());

app.get("/ping", (req, res) => res.send("pong"));

app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const results = await searchTracks(q);
  res.json(results);
});

app.get("/stream", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id" });

  const url = await getFastAudioUrl(id);
  if (!url) return res.status(500).json({ error: "No audio available" });

  res.json({ url });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 VibraAPI online na porta", PORT));
