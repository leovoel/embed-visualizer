export default {
  name: 'DiscordPHP (PHP)',
  language: 'php',
  generateFrom(data) {
    let embed = null;
    if (data.embed) {
      embed = JSON.stringify(data.embed, null, 4)
        .replace(/{/g, '[')
        .replace(/}/g, ']')
        .replace(/^ {4}/gm, '        ')
        .replace(/^]/gm, '    ]')
        .replace(/":/g, '" =>')
    }

    return `<?php

$message->channel->sendMessage('${data.content}', false, ${embed});`;

  }
};
