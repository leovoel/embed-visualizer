import React from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js';
import Modal from './modal';

import discord4j from '../snippets/discord4j';
import discordnet from '../snippets/discordnet';
import discordpy from '../snippets/discordpy';
import discordie from '../snippets/discordie';
import discordjs from '../snippets/discordjs';
import discordio from '../snippets/discordio';
import restcord from '../snippets/restcord';
import eris from '../snippets/eris';
import discordrb from '../snippets/discordrb';
import jda from '../snippets/jda';


const languages = {
  'dotnet_discord-net': discordnet,
  'python_discord-py': discordpy,
  'js_discordie': discordie,
  'js_discordjs': discordjs,
  'js_discordio': discordio,
  'js_eris': eris,
  'php_restcord': restcord,
  'ruby_discordrb': discordrb,
  'java_discord4j': discord4j,
  'java_jda': jda,
};

// TODO: check for localStorage availability?
// are we ever going to run into a browser that supports flexbox but not localStorage?

const CodeModal = React.createClass({
  getInitialState() {
    const keys = Object.keys(languages);
    let initial = keys[Math.floor(Math.random() * keys.length)];

    const stored = localStorage.getItem('codegen_lang');
    if (stored) {
      initial = stored;
    } else {
      localStorage.setItem('codegen_lang', initial);
    }

    return { language: initial };
  },

  componentDidMount() {
    this.highlightCode();
  },

  componentDidUpdate() {
    this.highlightCode();
  },

  changeLanguage(event) {
    localStorage.setItem('codegen_lang', event.target.value);
    this.setState({ language: event.target.value });
  },

  highlightCode() {
    const node = ReactDOM.findDOMNode(this);
    const codeBlock = node.querySelector('pre code');
    hljs.highlightBlock(codeBlock);
  },

  render() {
    const { data, hasError, webhookMode, ...props } = this.props;
    let code = 'Errors encountered when validating/parsing your data.\nCheck those first before trying to generate code.';
    let language = 'text';

    if (!hasError) {
      language = languages[this.state.language].language;
      code = languages[this.state.language].generateFrom(data);
    }

    if (webhookMode) {
      // TODO: add support for this in whatever libraries support it directly?
      // seems like very few of them do it
      code = 'Webhook mode not supported yet.';
    }

    return (
      <Modal title="Generate code" {...props} maxWidth="90ch">
        <div className="ma3">

          <div className="mv2 flex flex-auto flex-column">
            <div className="bg-dark-red washed-blue pa2 mb2">
              <strong>NOTE:</strong> These code snippets may need changes to work in your
              actual program, and they may not even be correct. Do <strong>NOT</strong> just copy and paste them in
              without understanding what they mean.
            </div>
            <select
              className="w-100 h2 mb2"
              value={this.state.language}
              onChange={this.changeLanguage}
            >
              {Object.keys(languages).sort().map(k => {
                return <option value={k} key={k}>{languages[k].name}</option>;
              })}
            </select>

            <pre className="ma0">
              <code
                ref={(c) => this.hljsBlock = c}
                className={`atom-one-${this.props.darkTheme ? 'dark' : 'light'} ${language}`}
              >
                {code}
              </code>
            </pre>
          </div>

        </div>
      </Modal>
    );
  },
});


export default CodeModal;
