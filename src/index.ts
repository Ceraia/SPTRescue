import { Client, GatewayIntentBits } from 'discord.js';
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = process.env.DISCORD_TOKEN;
const AUTHORIZED_USER_ID = process.env.AUTHORIZED_USER_ID;

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === '!rescue' && message.author.id === AUTHORIZED_USER_ID) {
        message.reply(`🔍 Finding container with label \`SPTRESCUE=true\`...`);

        // Find the container by label
        exec(`docker ps --filter "label=SPTRESCUE=true" --format "{{.ID}}"`, (error, stdout, stderr) => {
            if (error || stderr) {
                console.error(`Error: ${error?.message || stderr}`);
                message.reply(`❌ Error finding the container: ${error?.message || stderr}`);
                return;
            }

            const containerId = stdout.trim();
            if (!containerId) {
                message.reply(`⚠️ No running container found with label \`SPTRESCUE=true\`.`);
                return;
            }

            // Restart the found container
            message.reply(`🔄 Rebooting container \`${containerId}\`...`);
            exec(`docker restart ${containerId}`, (restartError, _restartStdout, restartStderr) => {
                if (restartError || restartStderr) {
                    console.error(`Restart Error: ${restartError?.message || restartStderr}`);
                    message.reply(`❌ Failed to reboot container: ${restartError?.message || restartStderr}`);
                    return;
                }
                message.reply(`✅ Successfully rebooted container \`${containerId}\`.`);
            });
        });
    }
});

client.login(TOKEN);
