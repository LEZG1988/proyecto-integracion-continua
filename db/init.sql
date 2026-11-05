-- Se ejecuta solo la primera vez que se crea el volumen de datos
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  creada TIMESTAMP DEFAULT NOW()
);
