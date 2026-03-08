FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_ENV_LABEL=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENV_LABEL=$NEXT_PUBLIC_ENV_LABEL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app ./
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
