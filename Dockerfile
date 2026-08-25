FROM node:20-alpine

WORKDIR /app

# Copy root and server dependencies
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy entire application
COPY . .

# Expose server port
EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Start unified server
CMD ["node", "server/server.js"]
