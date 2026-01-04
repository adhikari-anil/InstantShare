#Stage-1 Building vite app.. 
FROM node:22-alpine as build
WORKDIR /app

# Pass mode as build ARG (default to production)
#ARG MODE=production

COPY package*.json ./
RUN npm install
COPY . .

# Replace .env with the correct environment file
#RUN cp .env.${MODE} .env

RUN npm run build

# Stage 2: just keep built files (NO nginx here)
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist

CMD ["sh", "-c", "npx serve -s dist -l 3000"]