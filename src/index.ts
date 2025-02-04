import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = process.env.DISCORD_TOKEN;
const AUTHORIZED_USER_ID = process.env.AUTHORIZED_USER_ID;

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
    client.application?.commands.create(
        new SlashCommandBuilder().setName('rescue').setDescription('Rescue the SPT Client (ONLY USE IN CASE OF EMERGENCY)')
    );
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName == 'rescue') {
            await interaction.deferReply();
            await interaction.editReply({
                content: '‼️Are you sure you want to rescue the SPT Client? This will kick anyone who is in a match using the dedicated client‼️\n-# Only use if you know what you are doing!',
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId('rescue').setLabel('Wait...').setStyle(ButtonStyle.Danger).setDisabled(true))]
            }).then((
                msg
            ) => {
                setTimeout(() => {
                    msg.edit({
                        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId('rescue').setLabel('Rescue').setStyle(ButtonStyle.Danger))]
                    });
                }, 5000);
            })
        }
    } else if (interaction.isButton()) {
        if (interaction.customId == 'rescue') {
            if (interaction.user.id == AUTHORIZED_USER_ID) {
                await interaction.update({ content: '🔍 Finding container with label `SPTRESCUE=true`...', components: [] });
                exec(`docker ps --filter "label=SPTRESCUE=true" --format "{{.ID}}"`, (error, stdout, stderr) => {
                    if (error || stderr) {
                        console.error(`Error: ${error?.message || stderr}`);
                        interaction.editReply({ content: `❌ Error finding the container: ${error?.message || stderr}` });
                        return;
                    }

                    const containerId = stdout.trim();
                    if (!containerId) {
                        interaction.editReply({ content: `⚠️ No running container found with label \`SPTRESCUE=true\`.` });
                        return;
                    }

                    interaction.editReply({ content: `🔄 Rebooting container \`${containerId}\`...` });
                    exec(`docker restart ${containerId}`, (restartError, _restartStdout, restartStderr) => {
                        if (restartError || restartStderr) {
                            console.error(`Restart Error: ${restartError?.message || restartStderr}`);
                            interaction.editReply({ content: `❌ Failed to reboot container: ${restartError?.message || restartStderr}` });
                            return;
                        }
                        interaction.editReply({ content: `✅ Successfully rebooted container \`${containerId}\`.` });
                    });
                });
            } else {
                await interaction.update({ content: '❌ You are not authorized to perform this action.', components: [] });
            }
        }
    }
});

client.login(TOKEN);
