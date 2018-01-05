import React from 'react';
import Modal from './modal';
import SimpleMarkdown from 'simple-markdown';
import logo from '../images/logo.png';


// TODO: move this link out of here?
const GITHUB_REPO = 'https://github.com/leovoel/embed-visualizer';

const aboutText = `
-= Visualizer and validator for [Discord embeds][embed-docs]. =-

----------------------------------------------------------------

Its primary purpose is mostly just previewing how some given embed might appear on [Discord][discordapp],
but it also serves as a reference for the various limits that are imposed on embeds.

It also contains some primitive code generation, in case you're not sure how to
use embeds in your library of choice. If your library isn't here you can open an issue/make a pull request about it.

This tool is not officially part of [Discord][discordapp] or its [documentation][discord-docs].
It makes use of some assets derived/extracted from their application. This is
done for the sake of more helpful visuals, and not to infringe on their copyright.

The source code is available on [GitHub](${GITHUB_REPO}), under the MIT license.

### Webhook mode?

-----------------

The main difference is that instead of:

\`\`\`json
{
  "embed": {
    "name": "This is my really cool embed",
    ...
  }
}
\`\`\`

...you should have:

\`\`\`json
{
  "embeds": [
    { "name": "This is my really cool embed #1", ... },
    { "name": "This is my really cool embed #2", ... },
    ...
  ]
}
\`\`\`

...and that you can also use masked links - i.e. \`[title](url)\` - on the message content.

### Caveats

-----------

- No GUI for creating embeds (yet?)

  Currently the idea is you paste in some JSON and get a rendered version
  of it back, and maybe do minor edits.
  In the future some sort of form input mode could be added in.

- Invites are not rendered
- Mentions are not rendered

  This is purely out of laziness, although there's not much that can go wrong with them.  
  Keep in mind that in embeds, mentions are rendered but do not notify anyone.

- Images may not render exactly the same

  There is some logic for limiting sizes when rendering,
  that is hard to replicate due to the way this was written.

  It is probably possible to get it to work, but I don't
  think it's worth the effort (especially to reverse-engineer it out of the client).

  I don't also know if it's even necessary, hard to tell.

- JSON data is not exactly the actual data you can send

  It's not that it's wrong (it may be at some point in the future, but that's not a problem),
  but rather that there are properties we don't validate/render. This is by design.

  When in doubt, consult the [docs][embed-docs].


### Libraries used (thanks!):

-----------------------------
  
- [React](https://facebook.github.io/react/)
- [Ajv](https://epoberezkin.github.io/ajv/)
- [Moment.js](https://momentjs.com)
- [CodeMirror](https://codemirror.net)
- [highlight.js](https://highlightjs.org)
- [simple-markdown](https://github.com/Khan/simple-markdown)
- [Twemoji](https://github.com/twitter/twemoji)
- [lodash](https://lodash.com)
- [Tachyons](http://tachyons.io)


[discordapp]: https://discordapp.com/
[discord-docs]: https://discordapp.com/developers/docs/intro
[embed-docs]: https://discordapp.com/developers/docs/resources/channel#embed-object
`;

const rules = {
  ...SimpleMarkdown.defaultRules,

  center: {
    // really naive but we'll be ok
    match: SimpleMarkdown.blockRegex(/^-= (.*?) =-/),
    order: SimpleMarkdown.defaultRules.paragraph.order,

    parse(capture, recurseParse, state) {
      return { content: SimpleMarkdown.parseInline(recurseParse, capture[1], state) };
    },

    react(node, recurseOutput, state) {
      return <div key={state.key} className='db b f3 mv2 tc'>{recurseOutput(node.content, state)}</div>;
    }
  },

  paragraph: {
    ...SimpleMarkdown.defaultRules.paragraph,
    react(node, recurseOutput, state) {
      return <p key={state.key}>{recurseOutput(node.content, state)}</p>;
    },
  },

  link: {
    ...SimpleMarkdown.defaultRules.link,
    react(node, recurseOutput, state) {
      return (
        <a
          className='link blurple underline-hover'
          href={SimpleMarkdown.sanitizeUrl(node.target)}
          title={node.title}
          key={state.key}
          target='_blank'
        >
          {recurseOutput(node.content, state)}
        </a>
      );
    },
  },

  list: {
    ...SimpleMarkdown.defaultRules.list,
    react(node, recurseOutput, state) {
      return React.createElement(
        node.ordered ? 'ol' : 'ul',
        {
          start: node.start,
          key: state.key,
          className: 'mb4 pl4',
          children: node.items.map((item, i) => {
            return <li key={i}>{recurseOutput(item, state)}</li>;
          })
        }
      );
    },
  },

  hr: {
    ...SimpleMarkdown.defaultRules.hr,
    react(node, recurseOutput, state) {
      return <hr className='b--solid b--light-gray ma0' key={state.key} />;
    }
  },
};

const parser = SimpleMarkdown.parserFor(rules);
const renderer = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'));

const renderAboutText = (input) => {
  input += '\n\n';
  return renderer(parser(input, { inline: false }));
};

const AboutModal = (props) => {
  return (
    <Modal title='About' maxWidth='80ch' maxHeight='90%' {...props}>
      <div className='ma3 nested-copy-seperator nested-copy-line-height'>
        <div className='center w4'>
          <a href={GITHUB_REPO} title='Embed Visualizer' target='_blank'>
            <img src={logo} alt='Embed Visualizer' />
          </a>
        </div>
        {renderAboutText(aboutText)}
      </div>
    </Modal>
  );
};


export default AboutModal;
