const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/", (req, res) => {
  res.send("Proxy server aktif 🚀");
});

app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.send("Tambahkan ?url=https://example.com");

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://example.com"
      }
    });
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
