# SPT Rescue

SPT Rescue is a Discord bot designed to manage and rescue the SPT Client. This bot provides a command to reboot a Docker container running the SPT Client in case of emergencies.
It will restart Docker Containers with the `com.ceraia.sptrescue=true` flag.


## Features

- **Rescue Command**: A Discord slash command to reboot the SPT Client Docker container.
- **Permission Check**: Ensures only administrators can execute the rescue command.

## Prerequisites

- Docker
- Node.js
- Bun
- Discord Bot Token

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/sptrescue.git
    cd sptrescue
    ```

2. **Install dependencies**:
    ```sh
    bun install
    ```

3. **Create a `.env` file**:
    ```sh
    cp .env.example .env
    ```
    Fill in your Discord bot token in the `.env` file.

4. **Build the project**:
    ```sh
    bun run build
    ```

## Usage

1. **Start the bot**:
    ```sh
    bun run start
    ```

2. **Docker Compose**:
    Alternatively, you can use Docker Compose to run the bot:
    ```sh
    docker-compose up -d
    ```

## Docker

The project includes a `Dockerfile` and `docker-compose.yml` for containerization.

- **Dockerfile**: Defines the Docker image for the bot.
- **docker-compose.yml**: Defines the services and environment variables for Docker Compose.

## Commands

- **/rescue**: Reboots the SPT Client Docker container. Only available to administrators.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [your email].
