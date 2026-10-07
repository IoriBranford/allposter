import postDiscord from "./postDiscord";

const args = Bun.argv.slice(2);
const [to, post] = args;
const attach = args.slice(2);

if (!to)
    throw new Error("No platform given - must be one of discord, x, twitter, bsky")
if (!post)
    throw new Error("No post file");

switch (to) {
    case "discord":
        postDiscord("UpdateBot", post, attach);
        break;

    default:
        throw new Error(`Unknown platform ${to} - must be one of discord, x, twitter, bsky`)
}