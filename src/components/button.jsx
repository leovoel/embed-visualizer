import React from 'react';


const Button = ({ label, onClick, className='', colors='bg-white blurple' }) => {
  const base = 'dib b--none no-underline pointer ph3 pv2 ma1 br2';
  const cls = `${base} ${colors} ${className}`;
  return <button onClick={onClick} className={cls}>{label}</button>;
};


export default Button;
