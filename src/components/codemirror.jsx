import React from 'react';

import CM from 'codemirror';
import 'codemirror/lib/codemirror.css';

// generally you'd want to leave these up to the caller
// but we don't care about generalizing
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/mode/javascript/javascript';


const defaultOptions = {
  mode: { name: 'javascript', json: true },
  autoCloseBrackets: true,
  matchBrackets: true,
  tabSize: 2,
  extraKeys: {
    // see https://github.com/codemirror/CodeMirror/issues/988
    Tab: function (cm) {
      if (cm.somethingSelected()) {
        cm.indentSelection('add');
        return;
      }

      cm.execCommand('insertSoftTab');
    },
  },
  viewportMargin: Infinity,
};

const CodeMirror = React.createClass({
  getDefaultProps() {
    return {
      theme: 'default',
      preserveScrollPosition: false,
    };
  },

  componentDidMount() {
    this.instance = CM.fromTextArea(this.textarea, defaultOptions);
    this.updateTheme(this.props.theme);
    this.instance.on('change', this.valueChanged);
    this.focus();
  },

  componentWillUnmount() {
    if (this.instance) {
      this.instance.toTextArea();
    }
  },

  componentWillReceiveProps(next) {
    if (
      this.instance &&
      next.value !== undefined &&
      this.instance.getValue() !== next.value
    ) {
      if (this.props.preserveScrollPosition) {
        const previous = this.instance.getScrollInfo();
        this.instance.setValue(next.value);
        this.instance.scrollTo(previous.left, previous.top);
      } else {
        this.instance.setValue(next.value);
      }
    }

    if (next.theme) {
      this.updateTheme(next.theme);
    }
  },

  updateTheme(name) {
    this.instance.setOption('theme', name);
  },

  valueChanged(instance, change) {
    if (this.props.onChange && change.origin !== 'setValue') {
      this.props.onChange(this.instance.getValue(), change);
    }
  },

  render() {
    return (
      <div className='w-100 h-100'>
        <textarea
          ref={(textarea) => this.textarea = textarea}
          defaultValue={this.props.value}
          autoComplete='off'
        />
      </div>
    );
  },

  focus() {
    if (this.instance) {
      this.instance.focus();
    }
  },

});


export default CodeMirror;
