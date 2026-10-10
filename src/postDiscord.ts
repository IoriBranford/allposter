import { WebhookClient } from 'discord.js'; 
import { username, webhookId, webhookToken } from '../config.discord.json';

export default async function postDiscord(
    messageFile: string,
    attachmentFiles: string[] | undefined)
{
    const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

    const response = await webhookClient.send({
        content: await Bun.file(messageFile).text(),
        username,
        files: attachmentFiles?.map(f => ({
            attachment: f,
            name: f.match(`([^/\]+)$`)?.[0]
        }))
    });

    console.log(response);
}
