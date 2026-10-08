import { PasswordSession } from '@atproto/lex-password-session'
import { Client, toDatetimeString } from '@atproto/lex'
import * as app from './lexicons/app.js'
import { bskyName, bskyPassword } from '../config.bsky.json'

export default async function postBsky(
    messageFile: string,
    attachmentFiles: string[] | undefined)
{
    const session = await PasswordSession.login({
        service: 'https://bsky.social',
        identifier: bskyName,
        password: bskyPassword,
    })

    const client = new Client(session)

    const result = await client.create(app.bsky.feed.post, {
        text: await Bun.file(messageFile).text(),

        createdAt: toDatetimeString(new Date()),
    })
    console.log(result)
}