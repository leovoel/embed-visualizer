import React from 'react';


const Button = ({ label, onClick, className='' }) => {
  const base = 'dib b--none no-underline pointer ph3 pv2 ma1 br2';
  const colors = 'bg-white blurple';
  const cls = `${base} ${colors} ${className}`;
  return <button onClick={onClick} className={cls}>{label}</button>;
};


export default Button;
