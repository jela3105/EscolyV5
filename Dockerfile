# Use a lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Default CMD. docker-compose will override with its own "command".
CMD ["npm", "run", "start"]
