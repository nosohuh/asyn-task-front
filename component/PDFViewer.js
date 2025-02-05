import React from 'react';

export default function PDFViewer({ file }) {
  return (
    <div className="mt-4 w-full h-64 border-2 border-gray-300 rounded-lg">
      <embed src={file} type="application/pdf" width="100%" height="100%" />
    </div>
  );
}
