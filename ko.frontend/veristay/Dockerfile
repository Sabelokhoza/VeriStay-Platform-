# ---------------------------
#  Build stage
# ---------------------------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --force

# Copy source files
COPY . .

# Build Next.js app
RUN npm run build

# ---------------------------
#  Production stage
# ---------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy the build artifacts from builder
COPY --from=builder /app ./

# Expose the app port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
