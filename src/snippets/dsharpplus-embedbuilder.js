export default {
  name: "DSharpPlus ModernEmbedBuilder (C#)",
  language: "csharp",

  generateFrom(data) {

    const footerStyleCompact = false;
    const authorStyleCompact = false;

    const result = [];

    const push = e => result.push(e);

    // TODO: could use @"" to avoid escaping.
    const s = e => JSON.stringify(e);

    if (data.content) {
      push(`await new ModernEmbedBuilder`);
    } else {
      push(`new ModernEmbedBuilder`);
    }

    push(`{`);

    if (data.content) {
      push(`    Content = (${s(data.content)}),`);
    }

    const e = data.embed;

    if (!e) {
      return `You forgot the, uh, 'embed' bit of the embed.`;
    }

    if (e.title) {
      push(`    Title = ${s(e.title)},`);
    }

    if (e.description) {
      push(`    Description = ${s(e.description)},`);
    }

    if (e.url) {
      push(`    Url = ${s(e.url)},`);
    }

    if (e.color) { // use hex in case int is out of signed range
      push(`    Color = 0x${e.color.toString(16).toUpperCase()},`);
    }

    if (e.timestamp) {
      //push(`    Timestamp = ${Date.parse(e.timestamp)}UL`);
      push(`    Timestamp = ${s(e.timestamp)},`);
    }

    if (e.footer) {
      if (!footerStyleCompact) {
        if (!e.footer.icon_url) {
          push(`    Footer = ${s(e.footer.text)},`)
        } else {
          push(`    Footer = (${s(e.footer.text)}, ${s(e.footer.icon_url)}),`)
        }
      } else {
        if (e.footer.text    ) push(`    FooterText = ${s(e.footer.text    )},`);
        if (e.footer.icon_url) push(`    FooterIcon = ${s(e.footer.icon_url)},`);
      }
    }

    if (e.thumbnail) {
      if (e.thumbnail.url) {
        push(`    ThumbnailUrl = ${s(e.thumbnail.url)},`);
      } else {
        push(`    // warning: bad thumbnail <${s(e.thumbnail)}>`);
      }
    }

    if (e.image) {
      if (e.image.url) {
        push(`    ImageUrl = ${s(e.image.url)},`);
      } else {
        push(`    // warning: bad image <${s(e.image)}>`);
      }
    }

    if (e.author) {
      if (!authorStyleCompact) {
        if (!e.author.url && !e.author.icon_url) {
          push(`    Author = ${s(e.author.name)},`);
        } else {
          const author = [];

          if (e.author.name) {
            author.push(e.author.name);
          }
          if (e.author.url) {
            author.push(e.author.url);
          }
          if (e.author.icon_url) {
            author.push(e.author.icon_url);
          }

          push(`    Author = (${author.map(e => `${s(e)}`).join(', ')}),`);
        }
      } else {
        if (e.author.name) {
          push(`    AuthorName = ${s(e.author.name)},`);
        }
        if (e.author.url) {
          push(`    AuthorUrl = ${s(e.author.url)},`);
        }
        if (e.author.icon_url) {
          push(`    AuthorIcon = ${s(e.author.icon_url)},`);
        }
      }
    }

    if (e.fields && e.fields.length) {
      /*
       * 
        Fields =
        {
            "Field with just name",
            ("ay Name", "ay Value"),
            ("ay Name", "ay Value", inline: true),
       */
      push(`    Fields = `);
      push(`    {`);

      e.fields.forEach(e => {
        if (!e.value && !e.inline) {
          push(`        ${s(e.name)}`)
        } else {
          const field = [];
          if (e.name) field.push(s(e.name));
          if (e.value) field.push(s(e.value));
          if (e.inline) field.push('inline: true');

          push(`        (${field.join(', ')})`);
        }
      });

      push(`    }`);
    }

    if (data.content) {
      push(`}.Send(message);`);
    } else {
      push(`};`);
    }

    return result.join('\n');
  }
};