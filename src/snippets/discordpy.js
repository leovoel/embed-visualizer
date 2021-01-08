import Moment from "moment";

function pythonKwargs(args) {
  return Object.keys(args)
    .reduce((kwargs, key) => {
      if (args[key] !== null) {
        return kwargs.concat(`${key}=${args[key]}`);
      }

      return kwargs;
    }, [])
    .join(", ");
}

function toTitleCase(s) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export default {
  name: "discord.py (Python)",
  language: "python",
  webhook_support: true,
  generateFrom(data, isWebHook) {
    const embeds = [];
    const toIterate = isWebHook ? data.embeds || [] : [data.embed];

    toIterate.forEach((item, index) => {
      const result = [];

      if (item) {
        // TODO: don't duplicate this kind of parsing
        let timestamp = Moment(
          item.timestamp !== undefined ? item.timestamp : null
        );
        timestamp = timestamp.isValid() ? timestamp.unix() : null;

        const args = {
          title: item.title ? JSON.stringify(item.title) : null,
          colour: item.color
            ? `discord.Colour(0x${item.color.toString(16)})`
            : null,
          url: item.url ? JSON.stringify(item.url) : null,
          description: item.description
            ? JSON.stringify(item.description)
            : null,
          timestamp: timestamp
            ? `datetime.datetime.utcfromtimestamp(${timestamp})`
            : null,
        };
        const embedName = isWebHook ? `embed${index + 1}` : "embed";
        result.push(`${embedName} = discord.Embed(${pythonKwargs(args)})`);

        if (item.image || item.thumbnail || item.author || item.footer) {
          result.push("");
        }

        if (item.image) {
          const image = item.image;
          const args = { url: image.url ? JSON.stringify(image.url) : null };
          result.push(`${embedName}.set_image(${pythonKwargs(args)})`);
        }

        if (item.thumbnail) {
          const thumbnail = item.thumbnail;
          const args = {
            url: thumbnail.url ? JSON.stringify(thumbnail.url) : null,
          };
          result.push(`${embedName}.set_thumbnail(${pythonKwargs(args)})`);
        }

        if (item.author) {
          const author = item.author;
          const args = {
            name: author.name ? JSON.stringify(author.name) : null,
            url: author.url ? JSON.stringify(author.url) : null,
            icon_url: author.icon_url ? JSON.stringify(author.icon_url) : null,
          };
          result.push(`${embedName}.set_author(${pythonKwargs(args)})`);
        }

        if (item.footer) {
          const args = {
            text: item.footer.text ? JSON.stringify(item.footer.text) : null,
            icon_url: item.footer.icon_url
              ? JSON.stringify(item.footer.icon_url)
              : null,
          };

          result.push(`${embedName}.set_footer(${pythonKwargs(args)})`);
        }

        if (item.fields) {
          for (const field of item.fields) {
            const args = {
              name: field.name ? JSON.stringify(field.name) : null,
              value: field.value ? JSON.stringify(field.value) : null,
              inline:
                field.inline !== undefined
                  ? toTitleCase(field.inline.toString())
                  : null,
            };
            result.push(`${embedName}.add_field(${pythonKwargs(args)})`);
          }
        }
      }
      result.push("");
      embeds.push(result.join("\n"));
    });

    const final = [...embeds];
    if (isWebHook) {
      const args = {
        content: data.content ? JSON.stringify(data.content) : null,
        embeds:
          embeds.length > 0
            ? `[${Array(embeds.length)
                .fill()
                .map((_, index) => `embed${index + 1}`)
                .join(", ")}]`
            : null,
      };
      final.push(
        `webhook = Webhook.partial(123456, 'abcdefg', adapter=RequestsWebhookAdapter())`
      );
      final.push(`webhook.send(${pythonKwargs(args)})`);
    } else if (data.content || data.embed) {
      const args = {
        content: data.content ? JSON.stringify(data.content) : null,
        embed: embeds[0] ? "embed" : null,
      };
      final.push(`await ctx.send(${pythonKwargs(args)})`);
    }

    return final.join("\n");
  },
};
