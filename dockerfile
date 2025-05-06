FROM node:18

WORKDIR /app

COPY . .

RUN chmod +x /app/entrypoint.sh

RUN npm install

EXPOSE 4003

ENTRYPOINT ["/app/entrypoint.sh"]
