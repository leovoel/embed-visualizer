const fields = {
  title: (title) => `\t.WithTitle(${JSON.stringify(title)})`,
  description: (desc) => `\t.WithDescription(${JSON.stringify(desc)})`,
  url: (url) => `\t.WithUrl(${JSON.stringify(url)})`,
  color: (color) =>
    `\t.WithColor(new Color(0x${color.toString(16).toUpperCase()}))`,
  timestamp: (ts) =>
    `\t.WithTimestamp(DateTimeOffset.FromUnixTimeMilliseconds(${Date.parse(
      ts
    )}))`,
  footer: (footer) => generateFooter(footer),
  thumbnail: (thumb) => `\t.WithThumbnailUrl(${JSON.stringify(thumb.url)})`,
  image: (img) => `\t.WithImageUrl(${JSON.stringify(img.url)})`,
  author: (author) => generateAuthor(author),
  fields: (fields) => generateFields(fields),
};

function generateFooter(data) {
  let result = ["\t.WithFooter(footer => {\n\t\tfooter"];

  if (data.text) {
    result.push(`\t.WithText(${JSON.stringify(data.text)})`);
  }
  if (data.icon_url) {
    result.push(`\t.WithIconUrl(${JSON.stringify(data.icon_url)})`);
  }

  result[result.length - 1] += ";\n\t})";

  return result.join("\n\t\t");
}
function generateAuthor(data) {
  let result = ["\t.WithAuthor(author => {\n\t\tauthor"];

  result.push(`\t.WithName(${JSON.stringify(data.name)})`);

  if (data.url) {
    result.push(`\t.WithUrl(${JSON.stringify(data.url)})`);
  }
  if (data.icon_url) {
    result.push(`\t.WithIconUrl(${JSON.stringify(data.icon_url)})`);
  }

  result[result.length - 1] += ";\n\t})";

  return result.join("\n\t\t");
}
function generateFields(data) {
  return data
    .map(function (x) {
      if (x.inline) {
        return `\t.AddField(${JSON.stringify(x.name)}, ${JSON.stringify(
          x.value
        )}, true)`;
      } else {
        return `\t.AddField(${JSON.stringify(x.name)}, ${JSON.stringify(
          x.value
        )})`;
      }
    })
    .join("\n");
}

export default {
  name: "Discord.Net (C#)",
  language: "csharp",
  webhook_support: true,
  generateFrom(data, isWebhook) {
    const embeds = [];
    const toIterate = isWebhook ? data.embeds || [] : [data.embed];

    toIterate.forEach((item, index) => {
      if (!item) return;
      let result = [];
      result.push(
        `var ${
          isWebhook ? `builder${index + 1}` : "builder"
        } = new EmbedBuilder()`
      );
      for (let key in item) {
        if (fields[key]) {
          result.push(fields[key](item[key]));
        }
      }
      result[result.length - 1] += ";";
      if (!isWebhook) result.push("var embed = builder.Build();");

      embeds.push(result.join("\n"));
    });
    if (!isWebhook) {
      const final = [...embeds];

      if (embeds.length !== 0) {
        final.push(
          `await Context.Channel.SendMessageAsync(\n\t${
            data.content ? JSON.stringify(data.content) : "null"
          },\n\tembed: embed)\n\t.ConfigureAwait(false);`
        );

        return final.join("\n");
      } else {
        return `await Context.Channel.SendMessageAsync(${
          data.content ? JSON.stringify(data.content) : "null"
        })\n\t.ConfigureAwait(false);`;
      }
    }
    return ` using (var client = new DiscordWebhookClient("https://discord.com/api/webhooks/123/abc123"))
{
        ${embeds.join("\n\n        ")}
        await client.SendMessageAsync(text: ${
          data.content ? JSON.stringify(data.content) : "null"
        }, embeds: new[] { ${Array(embeds.length)
      .fill()
      .map((_, index) => `builder${index + 1}.Build()`)
      .join(", ")} });
}`;
  },
};
