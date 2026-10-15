FROM node:22.12.0 AS build
WORKDIR /app

COPY flowx-ui/package.json flowx-ui/package-lock.json* ./
RUN npm install

COPY flowx-ui/ ./
RUN npm run build

FROM nginx:1.27-alpine
COPY flowx-ui/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
