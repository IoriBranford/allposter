import { WebhookClient } from 'discord.js'; 
import { discordName, webhookId, webhookToken } from '../config.discordtest.json';

export default async function postDiscord(
    messageFile: string,
    attachmentFiles: string[] | undefined)
{
    const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

    webhookClient.send({
        content: await Bun.file(messageFile).text(),
        username: discordName,
        files: attachmentFiles?.map(f => ({
            attachment: f,
            name: f.match(`([^/\]+)$`)?.[0]
        }))
    });
}
