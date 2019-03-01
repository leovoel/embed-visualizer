function rubyKwargs(args) {
    return Object.keys(args).reduce((kwargs, key) => {
        if (args[key] !== null) {
            return kwargs.concat(`${key}: ${args[key]}`);
        }

        return kwargs;
    }, []).join(',\n      ');
}

export default {
    name: "Coxir (Elixir)",
    language: "elixir",
    generateFrom(data) {
        const result = [];

        if (data.content) {
            const args = {
                content: data.content ? JSON.stringify(data.content) : null,
                embed: data.embed ? 'embed' : null
            };

            result.push(`Message.reply(message, %{`);
            result.push(`  content: ${args['content']},`)
            result.push(`  embed: %{`);
        } else {
            result.push(`Message.reply(message, %{`);
            result.push(`  embed: %{`);
        }

        if (data.embed) {
            let timestamp = data.embed.timestamp  ? data.embed.timestamp : null;

            const args = {
                title: data.embed.title ? JSON.stringify(data.embed.title) : null,
                color: data.embed.color ? `0x${data.embed.color.toString(16)}` : null,
                url: data.embed.url ? JSON.stringify(data.embed.url) : null,
                description: data.embed.description ? JSON.stringify(data.embed.description) : null,
                timestamp: timestamp ? `"${data.embed.timestamp}"` : null
            };

            var pushed = false
            Object.keys(args).forEach(function(k) {
                if (args[k]) {
                    result.push(`    ${k}: ${args[k]},`)
                    pushed = true
                }
            })

            if (pushed) {
                result.push('')
            }

            if (data.embed.image) {
                const image = data.embed.image;
                const args = {
                    url: image.url ? JSON.stringify(image.url) : null
                };
                result.push(`    image: %{`);
                result.push(`      ${rubyKwargs(args)}`);
                result.push(`    },`);
            }

            if (data.embed.thumbnail) {
                const thumbnail = data.embed.thumbnail;
                const args = {
                    url: thumbnail.url ? JSON.stringify(thumbnail.url) : null
                };
                result.push(`    thumbnail: %{`);
                result.push(`      ${rubyKwargs(args)}`);
                result.push(`    },`);
            }

            if (data.embed.author) {
                const author = data.embed.author;
                const args = {
                    name: author.name ? JSON.stringify(author.name) : null,
                    url: author.url ? JSON.stringify(author.url) : null,
                    icon_url: author.icon_url ? JSON.stringify(author.icon_url) : null
                };
                result.push(`    author: %{`);
                result.push(`      ${rubyKwargs(args)}`);
                result.push(`    },`);
            }

            if (data.embed.footer) {
                const args = {
                    text: data.embed.footer.text ? JSON.stringify(data.embed.footer.text) : null,
                    icon_url: data.embed.footer.icon_url ? JSON.stringify(data.embed.footer.icon_url) : null
                };
                result.push(`    footer: %{`);
                result.push(`      ${rubyKwargs(args)}`);
                result.push(`    },`);
            }

            if (data.embed.fields) {
                result.push('');
                result.push('    fields: [')
                for (const field of data.embed.fields) {
                    const args = {
                        name: field.name ? JSON.stringify(field.name) : null,
                        value: field.value ? JSON.stringify(field.value) : null,
                        inline: field.inline !== undefined ? field.inline.toString() : null
                    };
                    result.push('     %{')
                    result.push(`      ${rubyKwargs(args)}`);
                    result.push('     },')
                }
                result.push('    ]')
            }

            result.push('  }')

            result.push('})')

        }

        return result.join('\n');
    }
};
