FROM node:current-alpine3.20

WORKDIR /app/.
COPY frontend/package.json .
RUN npm install

COPY frontend/. .
RUN chmod +x script.sh
CMD ["./script.sh"]
