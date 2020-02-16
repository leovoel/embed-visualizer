export default {
  name: 'discord.js v12 MessageEmbed (JavaScript)',
  language: 'javascript',
  generateFrom(data) {
    if (!data.embed && data.content) return `channel.send(${JSON.stringify(data.content)})`;

    const output = [];

    if (data.embed.title) output.push(`.setTitle(${JSON.stringify(data.embed.title)})`);
    if (data.embed.description) output.push(`.setDescription(${JSON.stringify(data.embed.description)})`);
    if (data.embed.url) output.push(`.setURL(${JSON.stringify(data.embed.url)})`);
    if (data.embed.color) output.push(`.setColor(${data.embed.color})`);
    if (data.embed.timestamp) output.push(`.setTimestamp(${JSON.stringify(data.embed.timestamp)})`);
    if (data.embed.thumbnail) output.push(`.setThumbnail(${JSON.stringify(data.embed.thumbnail.url)})`);
    if (data.embed.image) output.push(`.setImage(${JSON.stringify(data.embed.image.url)})`);
    if (data.embed.footer) {
      let text = data.embed.footer.text ? JSON.stringify(data.embed.footer.text) : null;
      let icon_url = data.embed.footer.icon_url ? JSON.stringify(data.embed.footer.icon_url) : null;

      output.push(icon_url ? `.setFooter(${text}, ${icon_url})` : `.setFooter(${text})`);
    }
    if (data.embed.author) {
      let author = data.embed.author.name ? JSON.stringify(data.embed.author.name) : null;
      let icon_url = data.embed.author.icon_url ? JSON.stringify(data.embed.author.icon_url) : null;
      let url = data.embed.author.url ? JSON.stringify(data.embed.author.url) : null;

      output.push(url ? `.setAuthor(${author}, ${icon_url}, ${url})` : icon_url ? `.setAuthor(${author}, ${icon_url})` : `.setAuthor(${author})`);
    }
    if (data.embed.fields && data.embed.fields.length !== 0) {
      for (const field of data.embed.fields) {
        let name = JSON.stringify(field.name);
        let value = JSON.stringify(field.value);
        output.push(field.inline ? `.addField(${name}, ${value}, ${field.inline})` : `.addField(${name}, ${value})`);
      }
    }

    const pre = `const embed = new MessageEmbed()\n  `;
    const result = pre + output.join('\n  ');
    if (data.content) return `${result};\nchannel.send(${JSON.stringify(data.content)}, embed);`;
    else return `${result}\nchannel.send(embed);`;
  }
};
