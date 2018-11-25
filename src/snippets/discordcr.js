import Moment from 'moment';


function rubyKwargs(args) {
  return Object.keys(args).reduce((kwargs, key) => {
    if (args[key] !== null) {
      return kwargs.concat(`${key}: ${args[key]}`);
    }

    return kwargs;
  }, []).join(', ');
}

export default {
  name: "discordcr (Crystal)",
  language: "crystal",
  generateFrom(data) {
    const result = [];

    if (data.content) {
      const args = {
        content: data.content ? JSON.stringify(data.content) : null,
        embed: data.embed ? 'embed' : null
      };

      result.push(`embed = Discord::Embed.new(`);
    } else {
      result.push('')
    }

    if (data.embed) {
      let timestamp = Moment(data.embed.timestamp !== undefined ? data.embed.timestamp : null);
      timestamp = timestamp.isValid() ? timestamp.unix() : null;

      const args = {
        title: data.embed.title ? JSON.stringify(data.embed.title) : null,
        colour: data.embed.color ? `0x${data.embed.color.toString(16)}` : null,
        url: data.embed.url ? JSON.stringify(data.embed.url) : null,
        description: data.embed.description ? JSON.stringify(data.embed.description) : null,
        timestamp: timestamp ? `Time.unix(${timestamp})` : null
      };

      var pushed = false
      Object.keys(args).forEach(function (k) {
        if (args[k]) {
          result.push(`  ${k}: ${args[k]},`)
          pushed = true
        }
      })

      if (pushed) {
        result.push('')
      }

      if (data.embed.image) {
        const image = data.embed.image;
        const args = { url: image.url ? JSON.stringify(image.url) : null };
        result.push(`  image: Discord::EmbedImage.new(${rubyKwargs(args)}),`);
      }

      if (data.embed.thumbnail) {
        const thumbnail = data.embed.thumbnail;
        const args = { url: thumbnail.url ? JSON.stringify(thumbnail.url) : null };
        result.push(`  thumbnail: Discord::EmbedThumbnail.new(${rubyKwargs(args)}),`);
      }

      if (data.embed.author) {
        const author = data.embed.author;
        const args = {
          name: author.name ? JSON.stringify(author.name) : null,
          url: author.url ? JSON.stringify(author.url) : null,
          icon_url: author.icon_url ? JSON.stringify(author.icon_url) : null
        };
        result.push(`  author: Discord::EmbedAuthor.new(${rubyKwargs(args)}),`);
      }

      if (data.embed.footer) {
        const args = {
          text: data.embed.footer.text ? JSON.stringify(data.embed.footer.text) : null,
          icon_url: data.embed.footer.icon_url ? JSON.stringify(data.embed.footer.icon_url) : null
        };

        result.push(`  footer: Discord::EmbedFooter.new(${rubyKwargs(args)}),`);
      }

      if (data.embed.fields) {
        result.push('');
        result.push('  fields: [')
        for (const field of data.embed.fields) {
          const args = {
            name: field.name ? JSON.stringify(field.name) : null,
            value: field.value ? JSON.stringify(field.value) : null,
            inline: field.inline !== undefined ? field.inline.toString() : null
          };
          result.push(`   Discord::EmbedField.new(${rubyKwargs(args)}),`);
        }
        result.push('  ]')
      }
      result.push(')')
      if (data.content) {
        const args = {
          content: data.content ? JSON.stringify(data.content) : null,
          embed: data.embed ? 'embed' : null
        };

        if (data.embed) {
          result.push(`client.create_message(payload.channel_id, ${args['content']}, embed)`);
        } else {
          result.push(`client.create_message(payload.channel_id, ${args['content']})`);
        }
      } else {

      }
    }

    return result.join('\n');
  }
};
