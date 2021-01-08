export default {
  name: "JDA (Java)",
  language: "java",
  webhook_support: true,
  generateFrom(data, isWebhook) {
    const embeds = [];
    const toIterate = isWebhook ? data.embeds || [] : [data.embed];
    const items = [];
    if (isWebhook) {
      items.push(
        `WebhookMessageBuilder builder = new WebhookMessageBuilder();`
      );
      if (data.content) {
        items.push(`builder.setContent(${JSON.stringify(data.content)});`);
      }
    } else {
      items.push(`new MessageBuilder()`);
      if (data.content) {
        items.push(`  .append(${JSON.stringify(data.content)})`);
      }
    }
    toIterate.forEach((item, index) => {
      if (!item) return;
      const result = [];

      if (item) {
        if (isWebhook)
          result.push(`  MessageEmbed embed${index + 1} = new EmbedBuilder()`);
        else result.push(`  .setEmbed(new EmbedBuilder()`);

        if (item.title) {
          const title = JSON.stringify(item.title);
          if (item.url) {
            const url = JSON.stringify(item.url);
            if (title) {
              result.push(`    .setTitle(${title}, ${url})`);
            }
          } else if (title) {
            result.push(`    .setTitle(${title})`);
          }
        }

        if (item.description) {
          const description = JSON.stringify(item.description);
          if (description) {
            result.push(`    .setDescription(${description})`);
          }
        }

        if (item.color) {
          result.push(`    .setColor(new Color(${item.color}))`);
        }

        if (item.timestamp) {
          const timestamp = JSON.stringify(item.timestamp);
          result.push(`    .setTimestamp(OffsetDateTime.parse(${timestamp}))`);
        }

        if (item.footer) {
          const text = item.footer.text
            ? JSON.stringify(item.footer.text)
            : null;
          const icon_url = item.footer.icon_url
            ? JSON.stringify(item.footer.icon_url)
            : null;
          result.push(`    .setFooter(${text}, ${icon_url})`);
        }

        if (item.thumbnail) {
          const thumbnail = item.thumbnail.url
            ? JSON.stringify(item.thumbnail.url)
            : null;
          if (thumbnail) {
            result.push(`    .setThumbnail(${thumbnail})`);
          }
        }

        if (item.image) {
          const image = item.image.url ? JSON.stringify(item.image.url) : null;
          if (image) {
            result.push(`    .setImage(${image})`);
          }
        }

        if (item.author) {
          const name = item.author.name
            ? JSON.stringify(item.author.name)
            : null;
          const url = item.author.url ? JSON.stringify(item.author.url) : null;
          const icon_url = item.author.icon_url
            ? JSON.stringify(item.author.icon_url)
            : null;
          result.push(`    .setAuthor(${name}, ${url}, ${icon_url})`);
        }

        if (item.fields) {
          for (const field of item.fields) {
            const name = field.name ? JSON.stringify(field.name) : null;
            const value = field.value ? JSON.stringify(field.value) : null;
            const inline =
              field.inline !== undefined ? field.inline.toString() : `false`;
            result.push(`    .addField(${name}, ${value}, ${inline})`);
          }
        }
        if (isWebhook) result.push(`    .build()`);
        else result.push(`    .build())`);
      }
      embeds.push(result.join("\n"));
    });
    if (!isWebhook) {
      const merged = [...items, ...embeds, `  .build();`];
      return merged.join("\n");
    }
    const merged = [...items, ...embeds];
    if (embeds.length > 0) {
      merged.push(`builder.addEmbeds(${Array(embeds.length)
        .fill()
        .map((_, index) => `embed${index + 1}`)
        .join(", ")})
       .setUsername("Username");`);
    }
    merged.push(`WebhookMessage message = builder.build();
client.send(message);`);
    return merged.join("\n");
  },
};
