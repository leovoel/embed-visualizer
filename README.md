Embed Visualizer
================

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

  // actual generator
  // data is just a javascript object that looks like this:
  // { "content": "message content...", "embed": { ... } }
  generateFrom(data) {
    ...
  },
};
```

Currently, we don't really take in account "webhook mode" since most libraries don't
really support that directly. If in the future most of them end up supporting it,
we can start passing that down to the `generateFrom` function, so that it can emit something else.

[embed docs]: https://discordapp.com/developers/docs/resources/channel#embed-object
