const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send("Proxy server aktif 🚀");
});

// Proxy route
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Tambahkan ?url=https://example.com");

  try {
    // Ambil header custom dari query
    const headers = {};
    if (req.query.ua) headers["User-Agent"] = req.query.ua;
    if (req.query.ref) headers["Referer"] = req.query.ref;
    if (req.query.cookie) headers["Cookie"] = req.query.cookie;
    if (req.query.auth) headers["Authorization"] = req.query.auth;

    // Bisa tambahkan header tambahan lainnya
    if (req.query.headers) {
      // headers tambahan dikirim sebagai JSON string
      try {
        const extra = JSON.parse(req.query.headers);
        Object.assign(headers, extra);
      } catch (e) {
        console.log("Header tambahan JSON invalid");
      }
    }

    const response = await fetch(target, { headers });
    const body = await response.buffer();
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");
    res.send(body);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Proxy server aktif 🚀 pada port ${port}`);
});
