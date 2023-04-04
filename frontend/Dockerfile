# Step 1: Build the React app
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Step 2: Serve the React app using Nginx
FROM nginx:alpine


EXPOSE 80

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
