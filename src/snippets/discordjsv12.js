// FROM https://github.com/leovoel/embed-visualizer/pull/44
export default {
  name: "discord.js v12 MessageEmbed (JavaScript)",
  language: "javascript",
  webhook_support: true,
  generateFrom(data, isWebhook) {
    if (!data.embed && !data.embeds && data.content)
      return `channel.send(${JSON.stringify(data.content)})`;
    const embeds = [];
    const toIterate = isWebhook ? data.embeds || [] : [data.embed];

    toIterate.forEach((item, index) => {
      if (!item) return;
      const output = [];

      if (item.title) output.push(`.setTitle(${JSON.stringify(item.title)})`);
      if (item.description)
        output.push(`.setDescription(${JSON.stringify(item.description)})`);
      if (item.url) output.push(`.setURL(${JSON.stringify(item.url)})`);
      if (item.color) output.push(`.setColor(${item.color})`);
      if (item.timestamp)
        output.push(`.setTimestamp(${JSON.stringify(item.timestamp)})`);
      if (item.thumbnail)
        output.push(`.setThumbnail(${JSON.stringify(item.thumbnail.url)})`);
      if (item.image)
        output.push(`.setImage(${JSON.stringify(item.image.url)})`);
      if (item.footer) {
        let text = item.footer.text ? JSON.stringify(item.footer.text) : null;
        let icon_url = item.footer.icon_url
          ? JSON.stringify(item.footer.icon_url)
          : null;

        output.push(
          icon_url ? `.setFooter(${text}, ${icon_url})` : `.setFooter(${text})`
        );
      }
      if (item.author) {
        let author = item.author.name ? JSON.stringify(item.author.name) : null;
        let icon_url = item.author.icon_url
          ? JSON.stringify(item.author.icon_url)
          : null;
        let url = item.author.url ? JSON.stringify(item.author.url) : null;

        output.push(
          url
            ? `.setAuthor(${author}, ${icon_url}, ${url})`
            : icon_url
            ? `.setAuthor(${author}, ${icon_url})`
            : `.setAuthor(${author})`
        );
      }
      if (item.fields && item.fields.length !== 0) {
        for (const field of item.fields) {
          let name = JSON.stringify(field.name);
          let value = JSON.stringify(field.value);
          output.push(
            field.inline
              ? `.addField(${name}, ${value}, ${field.inline})`
              : `.addField(${name}, ${value})`
          );
        }
      }

      const pre = `  const embed${
        isWebhook ? index + 1 : ""
      } = new MessageEmbed()\n  `;
      const result = pre + output.join("\n  ");
      embeds.push(result);
    });

    if (isWebhook) {
      return `const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

${embeds.join("\n")}
  webhookClient.send(${data.content ? JSON.stringify(data.content) : null}, {
	username: 'some-username',
	avatarURL: 'https://i.imgur.com/wSTFkRM.png',
	embeds: ${
    embeds.length === 0
      ? "[]"
      : `[${Array(embeds.length)
          .fill()
          .map((_, index) => `embed${index + 1}`)
          .join(", ")}]`
  },
});`;
    }

    if (data.content)
      return `${embeds.join("\n")};\nchannel.send(${JSON.stringify(
        data.content
      )}, { embed });`;
    else return `${embeds.join("\n")}\nchannel.send(embed);`;
  },
};
