//import { useLocation } from '@reach/router';
import React from 'react';

export default function TableOfContents({ data }) {
  //const location = useLocation();
  return (
    <>
      <div className="w-60 sticky top-20 max-h-[calc(100vh)] pb-32 ml-11 overflow-y-auto overscroll-contain">
        {data && (
          <div className="mb-3 font-semibold pt-9">
            <div className="mb-3">ON THIS PAGE</div>
            <div dangerouslySetInnerHTML={{ __html: data }} />
          </div>
        )}
      </div>
    </>
  );
}
