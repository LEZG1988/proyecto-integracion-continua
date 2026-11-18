# Imagen oficial de PostgreSQL con versión fija (no "latest")
FROM postgres:16.4-alpine

# El script se ejecuta solo la primera vez que se crea el volumen de datos
COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432
