FROM oven/bun:alpine

# Copy project
COPY . .

# Mount docker socket
VOLUME /var/run/docker.sock:/var/run/docker.sock

# Install docker-cli
RUN apk add --no-cache docker-cli

# Install project dependencies
RUN bun install

CMD ["bun", "run", "."]