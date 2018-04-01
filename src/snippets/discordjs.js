export default {
  name: 'discord.js (JavaScript)',
  language: 'javascript',

  // First draft, might have some bugs.
  generateFrom(data) {
    const result = [];
    result.push(`// All errors are your responsibility. Don't copy-paste this code unless you know what it does.`);

    if(data.embed) {
      result.push(`const embed = new RichEmbed()`);

      if(data.embed.color) result.push(`  .setColor(${data.embed.color})`);
      if(data.embed.title) result.push(`  .setTitle(${JSON.stringify(data.embed.title)})`);
      if(data.embed.url) result.push(`  .setURL(${JSON.stringify(data.embed.url)})`);
      if(data.embed.author) {
          const name = data.embed.author.name ? JSON.stringify(data.embed.author.name) : null;
          const url = data.embed.author.url ? `, ` + JSON.stringify(data.embed.author.url) : ``;
          const icon_url = data.embed.author.icon_url ? `, ` + JSON.stringify(data.embed.author.icon_url) : ``;
          if(name != null) result.push(`  .setAuthor(${name}${url}${icon_url})`);
      }
      if(data.embed.description) result.push(`  .setDescription(${JSON.stringify(data.embed.description)})`);
      if(data.embed.thumbnail) result.push(`  .setThumbnail(${JSON.stringify(data.embed.thumbnail)})`);
      if(data.embed.fields) {
          for(let field in data.embed.fields) {
              let name = field.name ? JSON.stringify(field.name) : null;
              let value = field.value ? JSON.stringify(field.value) : null;
              let inline = field.inline === undefined ? `` : `, ` + JSON.stringify(field.inline);
              result.push(`  .addField(${name}, ${value}${inline})`);
          }
      }
      if(data.embed.image) result.push(`  .setImage(${JSON.stringify(data.embed.image)})`);
      if(data.embed.footer) {
        const text = data.embed.footer.text ? JSON.stringify(data.embed.footer.text) : null;
        const icon_url = data.embed.footer.icon_url ? `, ` + JSON.stringify(data.embed.footer.icon_url) : ``;
        if(text != null) result.push(`  .setFooter(${text}${icon_url})`);
      }
      if(data.embed.timestamp) {
        let date = Date.parse(data.embed.timestamp);
        result.push(`  .setTimestamp(${date})`);
      }
    }

    let embedCode = result.join(`\n`) + `;`;

    if(!data.content) {
      return embedCode + `\n\nchannel.send(embed);`;
    } else {
      return embedCode + `\n\nchannel.send(${JSON.stringify(data.content)}, embed);`
    }
  }
};
