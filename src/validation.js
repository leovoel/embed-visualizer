import { botMessageSchema, webhookMessageSchema } from './constants/embedschema';


function traverseObject(object, path) {
  let result = object;

  for (const fragment of path) {
    if (fragment[fragment.length - 1] === ']') {
      // simple ~assumption~
      const indexStart = fragment.lastIndexOf('[');
      const indexEnd = fragment.lastIndexOf(']');

      const key = fragment.slice(0, indexStart);
      const array = result[key];

      if (array !== undefined || array !== null) {
        if (indexStart !== -1 && indexEnd !== -1) {
          const index = parseInt(fragment.slice(indexStart + 1, indexEnd), 10);
          const element = array[index];

          if (element === undefined || element === null) {
            break;
          }

          result = element;
        }
      }
    } else {
      const sub = result[fragment];
      if (sub === undefined || sub === null) break;
      result = sub;
    }
  }

  return result;
}

// TODO: rewrite these so that we can report errors during validation instead of after?
// in these we assume the data path is always NOT at the root
const customMessages = {
  additionalProperties(data, e) {
    let result = `Unrecognized property "${e.params.additionalProperty}"`;

    if (e.dataPath) {
      result += ` in "${e.dataPath.slice(1)}"`;
    }

    return result;
  },

  minProperties(data, e) {
    const dataPath = e.dataPath.slice(1);

    if (e.params.limit === 1) {
      return `"${dataPath}" should NOT be empty`;
    }

    return `"${dataPath}" ${e.message}`;
  },

  maxLength(data, e) {
    const dataPath = e.dataPath.slice(1);

    const path = dataPath.split('.');
    const dest = traverseObject(data, path);
    // count full code points instead of utf-16 code units
    const length = [...dest].length;

    return `"${dataPath}" ${e.message} (${length} currently)`;
  },

  maxItems(data, e) {
    const dataPath = e.dataPath.slice(1);

    const path = dataPath.split('.');
    const dest = traverseObject(data, path);
    const length = dest.length;

    return `"${dataPath}" ${e.message} (${length} currently)`;
  },

  // right now this is just being used for the timestamp
  // so we can safely assume this is all about it.
  // if we were to support more regex validators, this should
  // be a custom keyword or something.
  pattern(data, e) {
    const dataPath = e.dataPath.slice(1);

    const path = dataPath.split('.');
    const dest = traverseObject(data, path);

    let result = `"${dataPath}" is not a valid timestamp.`;

    const m = /^\d{4}-\d\d-\d\d(?:[T ]\d\d:\d\d:\d\d(?:\.\d+)?([+-]\d\d(?::\d\d)?)?)?$/.exec(dest);
    if (m) {
      result = `You can't specify UTC offsets in "${dataPath}", just Z or nothing (not even +00:00 is supported)`;
    }

    return result;
  }
}

function registerKeywords(ajv) {

  const disallowed = {
      type: 'object',
      errors: true,
      compile: function(disallowedProperties) {
      // we're assuming disallowedProperties is an array, so
      // code below is commented out.

      // const typeString = Object.prototype.toString.call(disallowedProperties);
      // if (typeString !== '[object Array]') {
      //   throw new Error('Expected [object Array], got ' + typeString);
      // }

      function disallowOne(data) {
        for (const property of disallowedProperties) {
          if (data[property] !== undefined) {
            disallowOne.errors = [];
            pushError(disallowOne.errors, property);
            return false;
          }
        }

        return true;
      }

      function disallowAny(data) {
        const errors = [];

        for (const property of disallowedProperties) {
          if (data[property] !== undefined) {
            pushError(errors, property);
          }
        }

        if (errors.length) {
          disallowAny.errors = errors;
        }

        return errors.length === 0;
      }

      function pushError(errors, name) {
        errors.push({
          keyword: 'disallowed',
          params: { propertyName: name },
          message: `should NOT contain "${name}"`
        });
      }

      return ajv._opts.allErrors ? disallowAny : disallowOne;
    }
  };

  const atLeastOneOf = {
    type: 'object',
    errors: true,
    compile: function(expectedProperties) {
      function inner(data) {
        for (const property in data) {
          if (expectedProperties.indexOf(property) !== -1) {
            return true;
          }
        }

        const expected = expectedProperties
          .map(property => `"${property}"`)
          .join(', ');

        inner.errors = [{
          keyword: 'atLeastOneOf',
          params: { expectedProperties },
          message: `should contain at least one of: ${expected}`
        }];

        return false;
      }

      return inner;
    }
  };

  const trim = {
    type: 'string',
    errors: true,
    compile: function(enabled) {
      function inner(data) {
        if (data && data.trim()) {
          return true;
        }

        inner.errors = [{
          keyword: 'trim',
          params: { enabled },
          message: 'should NOT be empty'
        }];

        return false;
      }

      if (enabled) {
        return inner;
      }

      // pass-thru
      return (data) => true;
    }
  };

  ajv.addKeyword('disallowed', disallowed);
  ajv.addKeyword('atLeastOneOf', atLeastOneOf);
  ajv.addKeyword('trim', trim);
  return ajv;
}

function stringifyErrors(data, errors, options) {
  // we expect the data to be passed as well since
  // that way we can report better errors.

  if (!errors) {
    return 'No errors';
  }

  const opt = {
    separator: '\n',
    root: 'root',
    ...options
  };

  let text = '';

  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];

    if (!error) {
      continue;
    }

    if (customMessages[error.keyword]) {
      text += customMessages[error.keyword](data, error) + opt.separator;
    } else {
      if (error.dataPath) {
        // dataPath starts with a dot, which we don't
        // want for properties on the top-level
        text += `"${error.dataPath.slice(1)}" ${error.message}${opt.separator}`;
      } else {
        text += `${opt.root} ${error.message}${opt.separator}`;
      }
    }
  }

  return text.slice(0, -opt.separator.length);
}

export { botMessageSchema, webhookMessageSchema, registerKeywords, stringifyErrors };
