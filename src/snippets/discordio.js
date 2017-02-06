export default {
  name: 'discord.io (JavaScript)',
  language: 'javascript',
  generateFrom(data) {
    const d = { to: '...', message: data.content, embed: data.embed };
    return `var data = ${JSON.stringify(d, null, '  ')};\nclient.sendMessage(data);`;
  }
};
