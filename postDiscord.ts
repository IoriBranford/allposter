import { EmbedBuilder, WebhookClient } from 'discord.js'; 
import { webhookId, webhookToken } from './config.json';

export default function postDiscord() {
    const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

    const embed = new EmbedBuilder().setTitle('Some Title').setColor(0x00ffff);

    webhookClient.send({
        content: 'Webhook test',
        username: 'some-username',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });
}
