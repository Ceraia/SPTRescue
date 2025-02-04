FROM oven/bun:alpine

COPY . .

RUN apk add --no-cache docker-cli

RUN bun install

CMD ["bun", "run", "."]