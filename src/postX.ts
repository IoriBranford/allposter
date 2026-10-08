import { Client } from '@xdevplatform/xdk';
import { bearerToken } from '../config.x.json'

export default async function postX(
    messageFile: string,
    attachmentFiles: string[] | undefined)
{
    const client = new Client({ bearerToken });

    const response = await client.posts.create({
        text: await Bun.file(messageFile).text(),
    });

    console.log(response);
}
