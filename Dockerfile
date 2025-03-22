# Build stage 
FROM node:20 AS builder

# copy workdirectory 
WORKDIR /app

# copy dependencies
COPY package*.json ./

# install dependiencies 
RUN npm install

# copy code 
COPY . .

# compile typescript 
RUN npm run build

# production stage 
FROM node:20

WORKDIR /app

# copy necessary from previous stage 
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# just install production dependencies 
RUN npm install --only=production

# Exponer puerto (Render puede configurarlo dinámicamente, pero opcionalmente puedes usar 3000 si así lo deseas)
EXPOSE 3000

# Iniciar la app
CMD ["node", "dist/app.js"]
