export default {
    name: "Discord4J (Java)",
    language: "java",

    generateFrom(data) {
        const result = [];

        if (data.content) {
            result.push(`new MessageBuilder(client)`);
            result.push(`  .appendContent(${JSON.stringify(data.content)})`)
        }

        if (data.embed) {
            result.push(`  .withEmbed(new EmbedBuilder()`);

            if (data.embed.title) {
                const title = JSON.stringify(data.embed.title);
                if (data.embed.url) {
                    const url = JSON.stringify(data.embed.url);
                    if (title) {
                        result.push(`    .withTitle(${title})`)
                        result.push(`    .withUrl(${url})`)
                    }
                }
                else if (title) {
                    result.push(`    .withTitle(${title})`)
                }
            }

            if (data.embed.description) {
                const description = JSON.stringify(data.embed.description);
                if (description) {
                    result.push(`    .withDesc(${description})`)
                }
            }

            if (data.embed.color) {
                result.push(`    .withColor(new Color(${data.embed.color}))`)
            }

            if (data.embed.timestamp) {
                const timestamp = JSON.stringify(data.embed.timestamp);
                result.push(`    .withTimestamp(OffsetDateTime.parse(${timestamp}).toLocalDateTime())`)
            }

            if (data.embed.footer) {
                const text = data.embed.footer.text ? JSON.stringify(data.embed.footer.text) : null;
                const icon_url = data.embed.footer.icon_url ? JSON.stringify(data.embed.footer.icon_url) : null;
                if (text != null) {
                    result.push(`    .withFooterText(${text})`)
                }
                if (icon_url != null) {
                    result.push(`    .withFooterIcon(${icon_url})`)
                }

            }

            if (data.embed.thumbnail) {
                const thumbnail = data.embed.thumbnail.url ? JSON.stringify(data.embed.thumbnail.url) : null;
                if (thumbnail) {
                    result.push(`    .withThumbnail(${thumbnail})`)
                }
            }

            if (data.embed.image) {
                const image = data.embed.image.url ? JSON.stringify(data.embed.image.url) : null;
                if (image) {
                    result.push(`    .withImage(${image})`)
                }
            }

            if (data.embed.author) {
                const name = data.embed.author.name ? JSON.stringify(data.embed.author.name) : null;
                const url = data.embed.author.url ? JSON.stringify(data.embed.author.url) : null;
                const icon_url = data.embed.author.icon_url ? JSON.stringify(data.embed.author.icon_url) : null;
                if (name != null) {
                    result.push(`    .withAuthorName(${name})`)
                }
                if (icon_url != null) {
                    result.push(`    .withAuthorIcon(${icon_url})`)
                }
                if (url != null) {
                    result.push(`    .withAuthorUrl(${url})`)
                }
            }

            if (data.embed.fields) {
                for (const field of data.embed.fields) {
                    const name = field.name ? JSON.stringify(field.name) : null;
                    const value = field.value ? JSON.stringify(field.value) : null;
                    const inline = field.inline !== undefined ? field.inline.toString() : `false`;
                    result.push(`    .appendField(${name}, ${value}, ${inline})`)
                }
            }

            result.push(`    .build())`);
        }

        result.push(`  .build();`);
        return result.join('\n');
    }
};
