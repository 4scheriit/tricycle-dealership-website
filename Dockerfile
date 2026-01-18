FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better Docker caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
