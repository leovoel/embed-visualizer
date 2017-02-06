import React from 'react';
import Moment from 'moment';
import Embed from './embed';
import { parse, jumboify } from './markdown';


const MessageTimestamp = React.createClass({
  getInitialState() {
    return { date: Moment().calendar() };
  },

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000 * 60);
  },

  componentWillUnmount() {
    clearInterval(this.timer);
  },

  tick() {
    this.setState({ date: Moment().calendar() });
  },

  render() {
    return <span className="timestamp">{this.state.date}</span>
  },
});

const ErrorHeader = ({ error }) => {
  if (!error) {
    return null;
  }

  return <header className="f6 bg-red br2 pa2 br--top w-100 code pre-wrap">{error}</header>;
};

const DiscordViewWrapper = ({ dark, children }) => {
  // yikes
  // we could actually just flatten the styling out on the respective elements,
  // but copying directly from discord is a lot easier than that
  return (
    <div className="w-100 h-100 overflow-auto pa2">
      <div className={`flex-vertical whitney ${dark && 'theme-dark'}`}>
        <div className="chat flex-vertical flex-spacer">
          <div className="content flex-spacer flex-horizontal">
            <div className="flex-spacer flex-vertical messages-wrapper">
              <div className="scroller-wrap">
                <div className="scroller messages">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscordView = React.createClass({
  getDefaultProps() {
    // TODO: make these configurable?
    return {
      username: 'Discord Bot',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',

      // hehe
      dark: true
    };
  },

  render() {
    const { username, avatar_url, error, data: { content, embed, embeds} } = this.props;

    const bgColor = this.props.dark ? 'bg-discord-dark' : 'bg-discord-light';
    const cls = `w-100 h-100 br2 flex flex-column white overflow-hidden ${bgColor}`;

    return (
      <div className={cls}>
        <ErrorHeader error={error} />
        <DiscordViewWrapper dark={this.props.dark}>
          <div className="message-group overflow-hidden">
            <div className="avatar-large animate" style={{ backgroundImage: `url('${avatar_url}')` }} />
            <div className="comment">
              <div className="message first">

                <h2 style={{ lineHeight: '16px' }}>
                  <span className="username-wrapper v-btm">
                    <strong className="user-name">{username}</strong>
                    <span className="bot-tag">BOT</span>
                  </span>
                  <span className="highlight-separator"> - </span>
                  <MessageTimestamp />
                </h2>

                <div className="message-text">
                  {content && <div className="markup">{parse(content, true, {}, jumboify)}</div>}
                </div>
              </div>

              {embed ? <Embed {...embed} /> : (embeds && embeds.map((e, i) => <Embed key={i} {...e} />))}

            </div>
          </div>
        </DiscordViewWrapper>
      </div>
    );
  },
});


export default DiscordView;
