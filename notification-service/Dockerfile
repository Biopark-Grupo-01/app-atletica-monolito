# 1. Base Image
FROM node:18-alpine AS base

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Build the application
RUN npm run build

# 7. Production Image
FROM node:18-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy built application from the 'base' stage
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package.json ./package.json
COPY --from=base /usr/src/app/src/firebase-service-account.json ./dist/firebase-service-account.json

# Expose the port the app runs on
EXPOSE 3003

# Start the app
CMD ["node", "dist/main"]
