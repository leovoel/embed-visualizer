import Moment from 'moment';


function pythonKwargs(args) {
  return Object.keys(args).reduce((kwargs, key) => {
    if (args[key] !== null) {
      return kwargs.concat(`${key}=${args[key]}`);
    }

    return kwargs;
  }, []).join(', ');
}

function toTitleCase(s) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export default {
  name: "discord.py (Python)",
  language: "python",
  generateFrom(data) {
    // TODO: minimize JSON.stringify?
    // this is kind of stupid as-is

    const result = [];

    if (data.embed) {
      // TODO: don't duplicate this kind of parsing
      let timestamp = Moment(data.embed.timestamp !== undefined ? data.embed.timestamp : null);
      timestamp = timestamp.isValid() ? timestamp.unix() : null;

      const args = {
        title: data.embed.title ? JSON.stringify(data.embed.title) : null,
        colour: data.embed.color ? `discord.Colour(0x${data.embed.color.toString(16)})` : null,
        url: data.embed.url ? JSON.stringify(data.embed.url) : null,
        description: data.embed.description ? JSON.stringify(data.embed.description) : null,
        timestamp: timestamp ? `datetime.datetime.utcfromtimestamp(${timestamp})` : null
      };

      result.push(`embed = discord.Embed(${pythonKwargs(args)})`);

      if (data.embed.image || data.embed.thumbnail || data.embed.author || data.embed.footer) {
        result.push('');
      }

      if (data.embed.image) {
        const image = data.embed.image;
        const args = { url: image.url ? JSON.stringify(image.url) : null };
        result.push(`embed.set_image(${pythonKwargs(args)})`);
      }

      if (data.embed.thumbnail) {
        const thumbnail = data.embed.thumbnail;
        const args = { url: thumbnail.url ? JSON.stringify(thumbnail.url) : null };
        result.push(`embed.set_thumbnail(${pythonKwargs(args)})`);
      }

      if (data.embed.author) {
        const author = data.embed.author;
        const args = {
          name: author.name ? JSON.stringify(author.name) : null,
          url: author.url ? JSON.stringify(author.url) : null,
          icon_url: author.icon_url ? JSON.stringify(author.icon_url) : null
        };
        result.push(`embed.set_author(${pythonKwargs(args)})`);
      }

      if (data.embed.footer) {
        const args = {
          text: data.embed.footer.text ? JSON.stringify(data.embed.footer.text) : null,
          icon_url: data.embed.footer.icon_url ? JSON.stringify(data.embed.footer.icon_url) : null
        };

        result.push(`embed.set_footer(${pythonKwargs(args)})`);
      }

      if (data.embed.fields) {
        result.push('');
        for (const field of data.embed.fields) {
          const args = {
            name: field.name ? JSON.stringify(field.name) : null,
            value: field.value ? JSON.stringify(field.value) : null,
            inline: field.inline !== undefined ? toTitleCase(field.inline.toString()) : null
          };
          result.push(`embed.add_field(${pythonKwargs(args)})`);
        }
      }

      result.push('');
    }

    if (data.content || data.embed) {
      const args = {
        content: data.content ? JSON.stringify(data.content) : null,
        embed: data.embed ? 'embed' : null
      };
      result.push(`await ctx.send(${pythonKwargs(args)})`);
    }

    return result.join('\n');
  }
};
