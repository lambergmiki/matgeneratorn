# Dockerfile
FROM node:22.7.0

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
# RUN npm install --omit=dev <- use this when going to production
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose app port
EXPOSE 5005

# Start the app
CMD ["npm", "start"]
