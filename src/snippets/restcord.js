export default {
  name: 'RestCord (PHP)',
  language: 'php',
  generateFrom(data) {
    let embed = null;
    if (data.embed) {
      embed = JSON.stringify(data.embed, null, 4)
          .replace(/{/g, '[')
          .replace(/}/g, ']')
          .replace(/^ {4}/gm, '        ')
          .replace(/^]/gm, '    ]');
    }

    return `<?php
    
$client->channel->createMessage([
    'channel.id' => $channelId,
    'content'    => "${data.content}",
    'embed'      => ${embed}
]);`;
  }
};
