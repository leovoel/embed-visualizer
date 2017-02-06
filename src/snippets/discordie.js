export default {
  name: 'discordie (JavaScript)',
  language: 'javascript',
  generateFrom(data) {
    if (data.embed) {
      return (
        `const data = ${JSON.stringify(data.embed, null, '  ')};\n` +
        `channel.sendMessage(${JSON.stringify(data.content)}, false, data);`
      );
    }

    return `channel.sendMessage(${JSON.stringify(data.content)});`;
  }
};
