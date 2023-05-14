# Start from the latest LTS version of Node.js
FROM node:18

# Create a directory for your app
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Compile typescript files
RUN npm run build

# Expose the port your app runs on
EXPOSE 3333

# Start your app
CMD ["npm", "run", "start:prod"]
