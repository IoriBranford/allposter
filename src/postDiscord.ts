import { WebhookClient } from 'discord.js'; 
import { webhookId, webhookToken } from '../config.test.json';

export default async function postDiscord(
    username: string,
    messageFile: string,
    attachmentFiles: string[] | undefined)
{
    const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

    webhookClient.send({
        content: await Bun.file(messageFile).text(),
        username,
        files: attachmentFiles?.map(f => ({
            attachment: f,
            name: f.match(`([^/\]+)$`)?.[0]
        }))
    });
}
