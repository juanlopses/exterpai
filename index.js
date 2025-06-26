const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Documentación básica en la raíz
app.get('/', (req, res) => {
  res.send(`
    <h1>YouTube Media API</h1>
    <p>API para obtener enlaces de descarga MP3 y MP4 desde YouTube.</p>

    <h2>Endpoints</h2>
    <ul>
      <li>
        <strong>GET /api/music?q=consulta</strong><br>
        Devuelve información y enlace de descarga en formato MP3.
      </li>
      <li>
        <strong>GET /api/video?q=consulta</strong><br>
        Devuelve información y enlace de descarga en formato MP4.
      </li>
    </ul>

    <h3>Ejemplos</h3>
    <ul>
      <li><a href="/api/music?q=DJ%20malam%20pagi%20slowed">/api/music?q=DJ malam pagi slowed</a></li>
      <li><a href="/api/video?q=DJ%20malam%20pagi%20slowed">/api/video?q=DJ malam pagi slowed</a></li>
    </ul>

    <p>Respuesta de error:</p>
    <pre>{ "error": "error" }</pre>
  `);
});

// Endpoint para obtener MP3
app.get('/api/music', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "error" });
  }

  const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status !== 200 || !data.result || !data.result.status) {
      return res.status(500).json({ error: "error" });
    }

    res.json({
      type: 'audio',
      title: data.result.metadata.title,
      author: data.result.metadata.author.name,
      videoUrl: data.result.metadata.url,
      thumbnail: data.result.metadata.thumbnail,
      duration: data.result.metadata.duration.timestamp,
      download: {
        quality: data.result.download.quality,
        url: data.result.download.url,
        filename: data.result.download.filename
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "error" });
  }
});

// Endpoint para obtener MP4
app.get('/api/video', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "error" });
  }

  const apiUrl = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status !== 200 || !data.result || !data.result.status) {
      return res.status(500).json({ error: "error" });
    }

    res.json({
      type: 'video',
      title: data.result.metadata.title,
      author: data.result.metadata.author.name,
      videoUrl: data.result.metadata.url,
      thumbnail: data.result.metadata.thumbnail,
      duration: data.result.metadata.duration.timestamp,
      download: {
        quality: data.result.download.quality,
        url: data.result.download.url,
        filename: data.result.download.filename
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "error" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
