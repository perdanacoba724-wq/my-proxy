const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
app.use(cors());

// Route root
app.get("/", (req, res) => {
  res.send("Proxy server aktif 🚀");
});

// Route proxy
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Tambahkan ?url=https://example.com");

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": req.query.ua || "Mozilla/5.0",
        "Referer": req.query.ref || target
      }
    });

    const body = await response.buffer();
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");
    res.send(body);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Proxy server aktif 🚀 pada port ${port}`);
});
