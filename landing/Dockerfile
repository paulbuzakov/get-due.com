# Stage 1: Install dependencies (used as the dev target)
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build static assets with Vite
FROM deps AS build
COPY . .
RUN npm run build

# Stage 3: Serve static files with nginx
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
