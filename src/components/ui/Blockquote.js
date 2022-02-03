import React from 'react';

const Blockquote = ({ children }) => {
  return (
    <aside className="border-substrateGreen border-l-8 pl-4 my-8 overflow-x-hidden">
      <div className="font-bold">{children}</div>
    </aside>
  );
};

export default Blockquote;
