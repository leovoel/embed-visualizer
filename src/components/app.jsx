import React from 'react';

import Button from './button';
import ModalContainer from './modalcontainer';
import AboutModal from './aboutmodal';
import CodeModal from './codemodal';
import CodeMirror from './codemirror';
import DiscordView from './discordview';

import Ajv from 'ajv';
import {
  botMessageSchema,
  webhookMessageSchema,
  registerKeywords,
  stringifyErrors
} from '../validation';


const ajv = registerKeywords(new Ajv({ allErrors: true }));
const validators = {
  regular: ajv.compile(botMessageSchema),
  webhook: ajv.compile(webhookMessageSchema)
};

const FooterButton = (props) => {
  return <Button {...props} className='shadow-1 shadow-hover-2 shadow-up-hover' />;
};

const Modals = {
  About(props) {
    return <AboutModal {...props} />;
  },
  Code(props) {
    return <CodeModal {...props} />;
  },
};

// this is just for convenience.
// TODO: vary this more?
const initialCode = JSON.stringify({
  content: 'this `supports` __a__ **subset** *of* ~~markdown~~ 😃 ```js\nfunction foo(bar) {\n  console.log(bar);\n}\n\nfoo(1);```',
  embed: {
    title: 'title ~~(did you know you can have markdown here too?)~~',
    description: 'this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```',
    url: 'https://discordapp.com',
    color: Math.floor(Math.random() * 0xFFFFFF),
    timestamp: new Date().toISOString(),
    footer: { icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png', text: 'footer text' },
    thumbnail: { url: 'https://cdn.discordapp.com/embed/avatars/0.png' },
    image: { url: 'https://cdn.discordapp.com/embed/avatars/0.png' },
    author: {
      name: 'author name',
      url: 'https://discordapp.com',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    fields: [
      { name: '🤔', value: 'some of these properties have certain limits...' },
      { name: '😱', value: 'try exceeding some of them!' },
      { name: '🙄', value: 'an informative error should show up, and this view will remain as-is until all issues are fixed' },
      { name: '<:thonkang:219069250692841473>', value: '???' }
    ]
  }
}, null, '  ');

const App = React.createClass({
  // TODO: serialize input, webhookMode, compactMode and darkTheme to query string?

  getInitialState() {
    return {
      webhookMode: false,
      compactMode: false,
      darkTheme: true,
      currentModal: null,
      input: initialCode,
      data: {},
      error: null
    };
  },

  validateInput(input, webhookMode) {
    let parsed, parseError, isValid, validationError;
    const validator = webhookMode ? validators.webhook : validators.regular;

    try {
      parsed = JSON.parse(input);
      isValid = validator(parsed);
      validationError = stringifyErrors(parsed, validator.errors);
    } catch (e) {
      parseError = e.message;
    }

    let data = this.state.data;
    if (isValid) {
      data = parsed;
    }

    let error = '';
    if (parseError) {
      error = parseError;
    } else if (!isValid) {
      error  = validationError;
    }

    // we set all these here to avoid some re-renders.
    // maybe it's okay (and if we ever want to
    // debounce validation, we need to take some of these out)
    // but for now that's what we do.
    this.setState({ input, data, error, webhookMode });
  },

  componentWillMount() {
    this.validateInput(this.state.input, this.state.webhookMode);
  },

  onCodeChange(value, change) {
    // for some reason this fires without the value changing...?
    if (value !== this.state.input) {
      this.validateInput(value, this.state.webhookMode);
    }
  },

  openAboutModal() {
    this.setState({ currentModal: Modals.About });
  },

  openCodeModal() {
    this.setState({ currentModal: Modals.Code });
  },

  closeModal() {
    this.setState({ currentModal: null });
  },

  toggleWebhookMode() {
    this.validateInput(this.state.input, !this.state.webhookMode);
  },

  toggleTheme() {
    this.setState({ darkTheme: !this.state.darkTheme });
  },

  toggleCompactMode() {
    this.setState({ compactMode: !this.state.compactMode });
  },

  render() {
    const webhookModeLabel = `${this.state.webhookMode ? 'Dis' : 'En'}able webhook mode`;
    const themeLabel = `${this.state.darkTheme ? 'Light' : 'Dark'} theme`;
    const compactModeLabel = `${this.state.compactMode ? 'Cozy' : 'Compact'} mode`;

    return (
      <main className="vh-100-l bg-blurple open-sans">

        <div className="h-100 flex flex-column">
          <section className="flex-l flex-auto">
            <div className="vh-100 h-auto-l w-100 w-50-l pa4 pr3-l pb0-l">
              <CodeMirror onChange={this.onCodeChange} value={this.state.input} />
            </div>
            <div className="vh-100 h-auto-l w-100 w-50-l pa4 pl3-l pb0">
              <DiscordView
                data={this.state.data}
                error={this.state.error}
                webhookMode={this.state.webhookMode}
                darkTheme={this.state.darkTheme}
                compactMode={this.state.compactMode}
              />
            </div>
          </section>

          <footer className="w-100 pa3 tc white">
            <FooterButton label="Generate code" onClick={this.openCodeModal} />
            <FooterButton label={webhookModeLabel} onClick={this.toggleWebhookMode} />
            <FooterButton label={themeLabel} onClick={this.toggleTheme} />
            <FooterButton label={compactModeLabel} onClick={this.toggleCompactMode} />
            <FooterButton label="About" onClick={this.openAboutModal} />
          </footer>
        </div>

        <ModalContainer
          close={this.closeModal}
          data={this.state.data}
          webhookMode={this.state.webhookMode}
          hasError={this.state.error !== null && this.state.error !== ''}
          currentModal={this.state.currentModal}
        />
      </main>
    );
  },
});


export default App;
