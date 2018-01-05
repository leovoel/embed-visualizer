export default {
    name: "DSharpPlus (C#)",
    language: "csharp",

    generateFrom(data) {

        const result = [];

        const push = e => result.push(e);

        // TODO: could use @"" to avoid escaping.
        const s = e => JSON.stringify(e);

        if (data.content) {
            push(`var builder = new DiscordEmbedBuilder()`);
        } else {
            push(`new DiscordEmbedBuilder()`);
        }

        const e = data.embed;

        if (!e) {
            return `You forgot the, uh, 'embed' bit of the embed.`;
        }

        if (e.title) {
            push(`.WithTitle(${s(e.title)})`);
        }

        if (e.description) {
            push(`.WithDescription(${s(e.description)})`);
        }

        if (e.url) {
            push(`.WithUrl(${s(e.url)})`);
        }

        if (e.color) { // use hex in case int is out of signed range
            push(`.WithColor(new DiscordColor(0x${e.color.toString(16).toUpperCase()}))`);
        }

        if (e.timestamp) {
            push(`.WithTimestamp(DateTimeOffset.FromUnixTimeMilliseconds(${Date.parse(e.timestamp)}UL))`);
        }

        if (e.footer) {
            push(`.WithFooter(`);
            push(`    ${e.footer.text     ? s(e.footer.text    ) : 'null'},`);
            push(`    ${e.footer.icon_url ? s(e.footer.icon_url) : 'null'}`);
            push(`)`);
        }

        if (e.thumbnail) {
            if (e.thumbnail.url) {
                push(`.WithThumbnailUrl(${s(e.thumbnail.url)})`);
            } else {
                push(`// warning: bad thumbnail <${s(e.thumbnail)}>`);
            }
        }

        if (e.image) {
            if (e.image.url) {
                push(`.WithImageUrl(${s(e.image.url)})`);
            } else {
                push(`// warning: bad image <${s(e.image)}>`);
            }
        }

        if (e.author) {
            push(`.WithAuthor(`);

            const author = [];

            if (e.author.name) {
                author.push(e.author.name);
            }
            if (e.author.url) {
                author.push(e.author.url);
            }
            if (e.author.icon_url) {
                author.push(e.author.icon_url);
            }

            push(author.map(e => `    ${s(e)}`).join(',\n'));

            push(`)`);
        }

        if (e.fields && e.fields.length) {
            //.AddField("<:thonkang:219069250692841473>", "are inline fields", true);
            e.fields.forEach(e => {
                push(`.AddField(${s(e.name)}, ${s(e.value)}, ${!!e.inline})`);
            });
        }

        result[result.length-1] += ';';

        push('');

        if (data.content) {
            push(`// await SendMessageAsync(`);
            push(`//     ${s(data.content)},`);
            push(`//     false, embed);`);
        } else {
            push(`// await SendMessageAsync(null, false, embed);`);
        }

        return result.join('\n');
    }
}; 