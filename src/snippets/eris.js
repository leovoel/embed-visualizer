export default {
  name: 'Eris (JavaScript)',
  language: 'javascript',
  generateFrom(data) {
    if (data.embed) {
      return `const data = ${JSON.stringify(data, null, '  ')};\nclient.createMessage(channelID, data);`;
    }

    return `client.createMessage(channelID, ${JSON.stringify(data.content)});`;
  }
};
