import { PasswordSession } from '@atproto/lex-password-session'
import { Client, toDatetimeString } from '@atproto/lex'
import * as app from './lexicons/app.js'
import { identifier, password } from '../config.bsky.test.json'
import isImage from 'is-image'
import isVideo from 'is-video'
import type { Image } from './lexicons/app/bsky/embed/images.defs.js'

async function postWithImages(client: Client, text: string, imageFiles: string[])
{
    const images = imageFiles.map(f => Bun.file(f).image());
    const alts = await Promise.all(imageFiles.map(async f => {
        try {
            return await Bun.file(`${f}.txt`).text();
        } catch (e) {
            return "";
        }
    }))

    const embedImages = await Promise.all(
        images.map(
            (img, i) => img.bytes()
                .then(bytes => client.uploadBlob(bytes))
                .then(upload => ({
                    image: upload.body.blob,
                    alt: alts[i],
                    aspectRatio: {
                        width: img.width, height: img.height
                    }
                } as Image))
        )
    )

    return client.create(app.bsky.feed.post, {
        text,
        createdAt: toDatetimeString(new Date()),
        embed: {
            $type: "app.bsky.embed.images",
            images: embedImages
        }
    })
}

export default async function postBsky(
    messageFile: string,
    attachmentFiles: string[] | undefined)
{
    const text = await Bun.file(messageFile).text()

    const session = await PasswordSession.login({
        service: 'https://bsky.social',
        identifier,
        password,
    });

    const client = new Client(session);

    const imageFiles = attachmentFiles?.filter(f => isImage(f)) || [];
    const videoFiles = attachmentFiles?.filter(f => isVideo(f)) || [];

    let result;

    if (imageFiles.length > 0) {
        if (videoFiles.length > 0)
            throw new Error("Can't embed both images and video");
        if (imageFiles.length > 4)
            throw new Error("Can't embed more than 4 images");

        result = await postWithImages(client, text, imageFiles);
    } else {
        result = await client.create(app.bsky.feed.post, {
            text,
            createdAt: toDatetimeString(new Date())
        })
    }
    console.log(result)
}