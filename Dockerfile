#Stage-1 Building vite app.. 
FROM node:22-alpine as build
WORKDIR /app

# Pass mode as build ARG (default to production)
#ARG MODE=production

COPY ./instantShare/package*.json ./
RUN npm install
COPY ./instantShare/. .

# Replace .env with the correct environment file
#RUN cp .env.${MODE} .env

RUN npm run build

#stage 2: Serve with Niginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]