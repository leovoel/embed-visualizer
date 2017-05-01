export default {
  name: 'discord.js (JavaScript)',
  language: 'javascript',
  generateFrom(data) {
    if (data.embed && data.content) {
      return (
        `const embed = ${JSON.stringify(data.embed, null, '  ')};\n` +
        `channel.send(${JSON.stringify(data.content)}, { embed });`
      );
    } else if (data.embed) {
      return `const embed = ${JSON.stringify(data.embed, null, '  ')};\nchannel.send({ embed });`;
    }

    return `channel.send(${JSON.stringify(data.content)})`;
  }
};
