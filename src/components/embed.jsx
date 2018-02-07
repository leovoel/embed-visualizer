import React from 'react';
import Moment from 'moment';
import { parseAllowLinks, parseEmbedTitle } from './markdown';
import { extractRGB } from '../color';


const Link = ({ children, ...props}) => {
  return <a target='_blank' rel='noreferrer' {...props}>{children}</a>;
};


const EmbedColorPill = ({ color }) => {
  let computed;

  if (color) {
    const c = extractRGB(color);
    computed = `rgba(${c.r},${c.g},${c.b},1)`;
  }

  const style = { backgroundColor: computed !== undefined ? computed : '' };
  return <div className='embed-color-pill' style={style} />;
}

const EmbedTitle = ({ title, url }) => {
  if (!title) {
    return null;
  }

  let computed = <div className='embed-title'>{parseEmbedTitle(title)}</div>;
  if (url) {
    computed = <Link href={url} className='embed-title'>{parseEmbedTitle(title)}</Link>;
  }

  return computed;
};

const EmbedDescription = ({ content }) => {
  if (!content) {
    return null;
  }

  return <div className='embed-description markup'>{parseAllowLinks(content)}</div>;
};

const EmbedAuthor = ({ name, url, icon_url }) => {
  if (!name) {
    return null;
  }

  let authorName;
  if (name) {
    authorName = <span className='embed-author-name'>{name}</span>;
    if (url) {
      authorName = <Link href={url} className='embed-author-name'>{name}</Link>;
    }
  }

  const authorIcon = icon_url ? (<img src={icon_url} role='presentation' className='embed-author-icon' />) : null;

  return <div className='embed-author'>{authorIcon}{authorName}</div>;
};

const EmbedField = ({ name, value, inline }) => {
  if (!name && !value) {
    return null;
  }

  const cls = 'embed-field' + (inline ? ' embed-field-inline' : '');

  const fieldName = name ? (<div className='embed-field-name'>{parseEmbedTitle(name)}</div>) : null;
  const fieldValue = value ? (<div className='embed-field-value markup'>{parseAllowLinks(value)}</div>) : null;

  return <div className={cls}>{fieldName}{fieldValue}</div>;
};

const EmbedThumbnail = ({ url }) => {
  if (!url) {
    return null;
  }

  return (
    <img
      src={url}
      role='presentation'
      className='embed-rich-thumb'
      style={{ maxWidth: 80, maxHeight: 80 }}
    />
  );
};

const EmbedImage = ({ url }) => {
  if (!url) {
    return null;
  }

  // NOTE: for some reason it's a link in the original DOM
  // not sure if this breaks the styling, probably does
  return <a className='embed-thumbnail embed-thumbnail-rich'><img className='image' role='presentation' src={url} /></a>;
};

const EmbedFooter = ({ timestamp, text, icon_url }) => {
  if (!text && !timestamp) {
    return null;
  }

  // pass null, since undefined will make moment(...) return the current date/time
  let time = Moment(timestamp !== undefined ? timestamp : null);
  time = time.isValid() ? time.format('ddd MMM Do, YYYY [at] h:mm A') : null;

  const footerText = [text, time].filter(Boolean).join(' • ');
  const footerIcon = text && icon_url ? (
    <img src={icon_url} className='embed-footer-icon' role='presentation' width='20' height='20' />
  ) : null;

  return <div>{footerIcon}<span className='embed-footer'>{footerText}</span></div>;
};

const EmbedFields = ({ fields }) => {
  if (!fields) {
    return null;
  }

  return <div className='embed-fields'>{fields.map((f, i) => <EmbedField key={i} {...f} />)}</div>;
};

const Embed = ({
  color, author, title, url, description, fields, thumbnail, image, timestamp, footer
}) => {
  return (
    <div className='accessory'>
      <div className='embed-wrapper'>
        <EmbedColorPill color={color} />
        <div className='embed embed-rich'>
          <div className='embed-content'>
            <div className='embed-content-inner'>
              <EmbedAuthor {...author} />
              <EmbedTitle title={title} url={url} />
              <EmbedDescription content={description} />
              <EmbedFields fields={fields} />
            </div>
            <EmbedThumbnail {...thumbnail} />
          </div>
          <EmbedImage {...image} />
          <EmbedFooter timestamp={timestamp} {...footer} />
        </div>
      </div>
    </div>
  );
};


export default Embed;
