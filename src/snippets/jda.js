export default {
  name: "JDA (Java)",
  language: "java",

  generateFrom(data) {
    const result = [];

    if (data.content) {
      result.push(`new MessageBuilder()`);
      result.push(`  .append(${JSON.stringify(data.content)})`)
    }

    if (data.embed) {
      result.push(`  .setEmbed(new EmbedBuilder()`);

      if (data.embed.title) {
        const title = JSON.stringify(data.embed.title);
        if (data.embed.url) {
          const url = JSON.stringify(data.embed.url);
          if (title) {
            result.push(`    .setTitle(${title}, ${url})`)
          }
        }
        else if (title) {
          result.push(`    .setTitle(${title})`)
        }
      }

      if (data.embed.description) {
        const description = JSON.stringify(data.embed.description);
        if (description) {
          result.push(`    .setDescription(${description})`)
        }
      }

      if (data.embed.color) {
        result.push(`    .setColor(new Color(${data.embed.color}))`)
      }

      if (data.embed.timestamp) {
        const timestamp = JSON.stringify(data.embed.timestamp);
        result.push(`    .setTimestamp(OffsetDateTime.parse(${timestamp}))`)
      }

      if (data.embed.footer) {
        const text = data.embed.footer.text ? JSON.stringify(data.embed.footer.text) : null;
        const icon_url = data.embed.footer.icon_url ? JSON.stringify(data.embed.footer.icon_url) : null;
        result.push(`    .setFooter(${text}, ${icon_url})`)
      }

      if (data.embed.thumbnail) {
        const thumbnail = data.embed.thumbnail.url ? JSON.stringify(data.embed.thumbnail.url) : null;
        if (thumbnail) {
          result.push(`    .setThumbnail(${thumbnail})`)
        }
      }

      if (data.embed.image) {
        const image = data.embed.image.url ? JSON.stringify(data.embed.image.url) : null;
        if (image) {
          result.push(`    .setImage(${image})`)
        }
      }

      if (data.embed.author) {
        const name = data.embed.author.name ? JSON.stringify(data.embed.author.name) : null;
        const url = data.embed.author.url ? JSON.stringify(data.embed.author.url) : null;
        const icon_url = data.embed.author.icon_url ? JSON.stringify(data.embed.author.icon_url) : null;
        result.push(`    .setAuthor(${name}, ${url}, ${icon_url})`)
      }

      if (data.embed.fields) {
        for (const field of data.embed.fields) {
          const name = field.name ? JSON.stringify(field.name) : null;
          const value = field.value ? JSON.stringify(field.value) : null;
          const inline = field.inline !== undefined ? field.inline.toString() : `false`;
          result.push(`    .addField(${name}, ${value}, ${inline})`)
        }
      }

      result.push(`    .build())`);
    }

    result.push(`  .build();`);
    return result.join('\n');
  }
};
