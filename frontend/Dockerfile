FROM node:current-alpine3.20 AS base

WORKDIR /app/.
COPY package.json .
RUN npm install

FROM base AS development
COPY . .
RUN chmod +x script.sh
CMD ["./script.sh"]

FROM base AS build
COPY . .
RUN ["npm", "run", "build"]

FROM nginx:1.27-alpine3.20-slim AS production
COPY frontend/nginx_config/default.conf /etc/nginx/conf.d/.
COPY --from=build /app/build /usr/share/nginx/html
