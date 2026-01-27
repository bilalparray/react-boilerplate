# -------- Build --------
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV VITE_API_URL=http://13.235.53.15:8081/api/v1
RUN npx vite build
# -------- Runtime --------
FROM node:22-alpine
WORKDIR /app

RUN npm install -g vite
COPY --from=build /app/dist ./dist

EXPOSE 4200
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4200"]

