# Use Node.js official image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy app source (do NOT copy node_modules)
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 5173

# Start app
CMD ["npm", "start"]
