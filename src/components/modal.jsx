import React from 'react';


const Modal = React.createClass({
  propTypes: {
    maxWidth: React.PropTypes.string,
    maxHeight: React.PropTypes.string,
    title: React.PropTypes.string,
    close: React.PropTypes.func,
    children: React.PropTypes.node
  },

  getDefaultProps() {
    return { maxWidth: '60vw', maxHeight: '90vh' };
  },

  componentDidMount()    { document.body.style.overflow = 'hidden'; },
  componentWillUnmount() { document.body.style.overflow = 'auto';   },

  render() {
    const cls = 'z-1 inner shadow-3 br2 overflow-hidden flex flex-column open-sans';

    const style = {
      maxWidth: this.props.maxWidth,
      maxHeight: this.props.maxHeight
    };

    return (
      <div className={cls} style={style}>
        <header className='bg-blurple white pa3 flex flex-shrink-0 justify-between'>
          <h3 className='ma0'>{this.props.title}</h3>
          <button onClick={this.props.close} className='b bg-transparent pointer white b--none'>X</button>
        </header>
        <div className='bg-white h-100 overflow-y-auto'>
          {this.props.children}
        </div>
      </div>
    );
  },
});


export default Modal;
