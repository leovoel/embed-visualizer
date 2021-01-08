# Embed Visualizer

![demo gif](http://i.imgur.com/2wAb2d3.gif)

### Code snippet generators

The general structure for them looks like this:

```js
export default {
  // for displaying on the <select> dropdown
  name: 'Cool Discord Lib (Cool Programming Language)',

  // for highlight.js
  // see https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html#language-names-and-aliases
  language: 'coolprogramminglanguage',

  // Decides if the library has webhook support or not.
  // If not set to false and a info will be displayed
  webhook_support: true,

  // actual generator
  // If webhook mode is enabled and supported the list of provided embeds will be in the "embeds" property, otherwise the single embed will be in "embed"
  // data is just a javascript object that looks like this:
  // { "content": "message content...", "embed": { ... }, "embeds": [ { ... }, { ...}] }
  // isWebhook will (if webhook mode is supported) be a boolean indicating if the mode is set to webhook(true) or normal(false).
  // if theres no support, this param may be omited
  generateFrom(data, isWebhook) {
    ...
  },
};
```

[embed docs]: https://discordapp.com/developers/docs/resources/channel#embed-object
