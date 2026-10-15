FROM node:22.12.0 AS build
WORKDIR /app

COPY ui/package.json ui/package-lock.json* ./
RUN npm install

COPY ui/ ./
RUN npm run build

FROM nginx:1.27-alpine
COPY ui/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/finquant-ui/browser /usr/share/nginx/html
EXPOSE 80

