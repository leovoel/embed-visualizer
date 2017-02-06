export default {
  name: 'discord.js (JavaScript)',
  language: 'javascript',
  generateFrom(data) {
    if (data.embed && data.content) {
      return (
        `const embed = ${JSON.stringify(data.embed, null, '  ')};\n` +
        `channel.sendMessage(${JSON.stringify(data.content)}, embed);`
      );
    } else if (data.embed) {
      return `const embed = ${JSON.stringify(data.embed, null, '  ')};\nchannel.sendEmbed(embed);`;
    }

    return `channel.sendMessage(${JSON.stringify(data.content)})`;
  }
};
