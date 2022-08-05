import * as React from 'react';

function SvgFeTemplate(props) {
  return (
    <svg width={32} height={25} viewBox="0 0 32 25" {...props}>
      <path d="M29 0H3C1.34375 0 0 1.19978 0 2.67857V22.3214C0 23.8002 1.34375 25 3 25H29C30.6562 25 32 23.8002 32 22.3214V2.67857C32 1.19978 30.6562 0 29 0ZM29 21.9866C29 22.1708 28.8312 22.3214 28.625 22.3214H3.375C3.16875 22.3214 3 22.1708 3 21.9866V8.92857H29V21.9866Z" />
    </svg>
  );
}

export default SvgFeTemplate;
