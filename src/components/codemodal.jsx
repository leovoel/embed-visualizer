import React from 'react';
import hljs from 'highlight.js';
import Modal from './modal';

import discord4j from '../snippets/discord4j';
import discordnet from '../snippets/discordnet';
import dsharpplus from '../snippets/dsharpplus';
import dsharpplusEmbedbuilder from '../snippets/dsharpplus-embedbuilder';
import discordpy from '../snippets/discordpy';
import discordie from '../snippets/discordie';
import discordjs from '../snippets/discordjs';
import discordio from '../snippets/discordio';
import restcord from '../snippets/restcord';
import eris from '../snippets/eris';
import discordrb from '../snippets/discordrb';
import jda from '../snippets/jda';


const libraries = {
  'dotnet_discord-net': discordnet,
  'dotnet_dsharpplus': dsharpplus,
  'dotnet_dsharpplusEmbedbuilder': dsharpplusEmbedbuilder,
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

const LOCAL_STORAGE_KEY = 'codegen_lib';

const CodeModal = React.createClass({
  getInitialState() {
    const keys = Object.keys(libraries);
    let initial = keys[Math.floor(Math.random() * keys.length)];

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      initial = stored;
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, initial);
    }

    return { library: initial };
  },

  changeLibrary(event) {
    localStorage.setItem('codegen_lang', event.target.value);
    this.setState({ library: event.target.value });
  },

  render() {
    const { data, hasError, webhookMode, ...props } = this.props;
    let code = 'Errors encountered when validating/parsing your data.\nCheck those first before trying to generate code.';
    let language = 'accesslog';

    if (webhookMode) {
      // TODO: add support for this in whatever libraries support it directly?
      // seems like very few of them do it
      code = 'Webhook mode not supported yet.';
    } else if (!hasError) {
      language = libraries[this.state.library].language;
      code = libraries[this.state.library].generateFrom(data);
    }

    const theme = `atom-one-${this.props.darkTheme ? 'dark' : 'light'}`;
    const highlightedBlock = hljs.highlight(language, code, true);

    return (
      <Modal title='Generate code' {...props} maxWidth='90ch'>
        <div className='ma3'>

          <div className='mv2 flex flex-auto flex-column'>
            <div className='bg-dark-red washed-blue pa2 mb2'>
              <strong>NOTE:</strong> These code snippets may need changes to work in your
              actual program, and they may not even be correct. Do <strong>NOT</strong> just copy and paste them in
              without understanding what they mean.
            </div>
            <select
              className='w-100 h2 mb2'
              value={this.state.library}
              onChange={this.changeLibrary}
            >
              {Object.keys(libraries).sort().map(k => {
                return <option value={k} key={k}>{libraries[k].name}</option>;
              })}
            </select>

            <pre className='ma0'>
              <code
                className={`${theme} hljs ${highlightedBlock.language}`}
                dangerouslySetInnerHTML={{ __html: highlightedBlock.value }}
              />
            </pre>
          </div>

        </div>
      </Modal>
    );
  },
});

function wrapper(props) {
  return <CodeModal {...props} />;
}


export default wrapper;
