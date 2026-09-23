"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to avoid SSR hydration issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500 font-mono text-xs">
      Loading Monaco Editor...
    </div>
  ),
});

interface MonacoEditorContainerProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function MonacoEditorContainer({ value, onChange, readOnly = false }: MonacoEditorContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-slate-900 p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className="h-full w-full resize-none bg-transparent font-mono text-sm text-slate-200 focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <MonacoEditor
        height="100%"
        language="python"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || "")}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          readOnly,
          lineNumbers: "on",
          roundedSelection: false,
          padding: { top: 12, bottom: 12 },
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
        }}
      />
    </div>
  );
}
