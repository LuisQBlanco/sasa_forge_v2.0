FROM node:20-alpine

WORKDIR /app

COPY --chown=node:node package.json ./
USER node
RUN npm install

COPY --chown=node:node . .

ENV EXPO_PUBLIC_API_URL=http://localhost/api

CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]
