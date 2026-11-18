# Misma imagen base que la API, con versión fija
FROM node:22.11.0-alpine3.20

WORKDIR /pruebas
COPY comunicacion.test.js ./

# node:test viene incluido en Node.js: no hay dependencias que instalar
CMD ["node", "--test", "--test-reporter=spec", "comunicacion.test.js"]
