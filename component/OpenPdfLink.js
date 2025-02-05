import React from 'react';

export default function OpenPDFLink({ openPDFInNewWindow }) {
  return (
    <div className="mt-4">
      <a
        
        onClick={(e) => {
          e.preventDefault();
          openPDFInNewWindow();
        }}
        className="text-blue-500"
      >
      </a>
    </div>
  );
}
