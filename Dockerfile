# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install  

COPY . .
RUN npm run build

# Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/app.js"]
