'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function UploadDocuments() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12">
      <h1 className="text-3xl font-bold mb-4">Upload Supporting Documents</h1>
      <p className="text-muted-foreground mb-8">
        Please securely upload your ID and income proof for your loan application.
      </p>

      <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-2xl p-12 text-center transition-all hover:bg-primary/10 cursor-pointer" onClick={() => setUploaded(true)}>
        {!uploaded ? (
          <>
            <UploadCloud className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">Click to browse your files</h3>
            <p className="text-sm text-muted-foreground">PDF, JPEG or PNG up to 10MB</p>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mb-1">Documents Uploaded</h3>
            <p className="text-sm text-muted-foreground">Your files have been securely attached to your application.</p>
          </>
        )}
      </div>
    </div>
  );
}
