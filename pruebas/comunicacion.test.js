// Pruebas de integración: se ejecutan dentro de la red de Docker y llaman a la API
// por el NOMBRE DEL SERVICIO ("api"). Si alguna falla, el proceso termina con error
// y el build de Jenkins queda en rojo.
const { test } = require('node:test');
const assert = require('node:assert/strict');

const API = process.env.API_URL || 'http://api:3000';

test('la API llega a la base de datos por el nombre del servicio "db"', async () => {
  const r = await fetch(`${API}/health`);
  const cuerpo = await r.json();
  assert.equal(r.status, 200, `La API no pudo consultar la base de datos: ${JSON.stringify(cuerpo)}`);
  assert.equal(cuerpo.db, 'ok');
  assert.equal(cuerpo.dbHost, 'db', 'La API debe conectarse usando el nombre del servicio "db"');
});

test('ida y vuelta: una tarea guardada se puede leer de la base de datos', async () => {
  const titulo = `prueba-jenkins-${Date.now()}`;

  const post = await fetch(`${API}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo }),
  });
  assert.equal(post.status, 201, 'El POST /tareas debe responder 201');
  const creada = await post.json();
  assert.equal(creada.titulo, titulo);

  const get = await fetch(`${API}/tareas`);
  assert.equal(get.status, 200, 'El GET /tareas debe responder 200');
  const tareas = await get.json();
  assert.ok(tareas.some((t) => t.id === creada.id && t.titulo === titulo), 'La tarea guardada no aparece al leer');
});

test('la API rechaza una tarea sin título', async () => {
  const r = await fetch(`${API}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(r.status, 400);
});
