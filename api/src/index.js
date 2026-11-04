const express = require('express');
const { Pool } = require('pg');

const app = express();
app.disable('x-powered-by'); // no revelar la tecnología del servidor
app.use(express.json());

// La API se conecta a la base de datos por el NOMBRE DEL SERVICIO ("db"),
// que Docker resuelve dentro de la red del compose. Nada de localhost ni IP fija.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

app.get('/health', async (req, res) => {
  try {
    const r = await pool.query('SELECT NOW() AS hora');
    res.json({ api: 'ok', db: 'ok', dbHost: process.env.DB_HOST, hora: r.rows[0].hora });
  } catch (err) {
    res.status(500).json({ api: 'ok', db: 'error', detalle: err.message });
  }
});

// Ida: guarda una tarea en la base de datos
app.post('/tareas', async (req, res) => {
  const { titulo } = req.body || {};
  if (!titulo) return res.status(400).json({ error: 'El campo "titulo" es obligatorio' });
  try {
    const r = await pool.query('INSERT INTO tareas (titulo) VALUES ($1) RETURNING *', [titulo]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vuelta: lee las tareas guardadas
app.get('/tareas', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM tareas ORDER BY id');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JSON mal formado: responde un error claro sin exponer detalles internos
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  res.status(500).json({ error: 'Error interno' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API escuchando en el puerto ${port}`));
