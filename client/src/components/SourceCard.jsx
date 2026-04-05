import React from 'react';
import './SourceCard.css';

const SourceCard = ({ url, title, index }) => {
  let displayUrl = url;
  try {
    const urlObj = new URL(url);
    displayUrl = urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname.slice(0, 15) + '...' : '');
  } catch (e) {}

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="source-pill fade-in" 
      style={{ animationDelay: `${index * 50}ms` }}
      title={title}
    >
      <span className="source-text">{displayUrl}</span>
    </a>
  );
};

export default SourceCard;
