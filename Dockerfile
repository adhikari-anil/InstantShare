#Stage-1 Building vite app.. 
FROM node:22-alpine As builder
WORKDIR /app

# Pass mode as build ARG (default to production)
ARG MODE=production

COPY package*.json ./
RUN npm install
COPY . .

# Replace .env with the correct environment file
RUN cp .env.${MODE} .env

RUN npm run build


#stage 2: Serve with Niginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.config /etc/nginx/config.d/default.config
EXPOSE 80
CMD ["nginx","-g","daemon off;"]