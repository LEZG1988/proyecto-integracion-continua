# Imagen oficial de Node con versión fija (no "latest")
FROM node:22.11.0-alpine3.20

WORKDIR /app

# Primero las dependencias, para aprovechar la caché de capas
COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
