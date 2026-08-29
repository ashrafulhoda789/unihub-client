"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language = "javascript" }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0d152a]">
            <Editor
                height="100%"
                width="100%"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    lineNumbersMinChars: 3,
                    glyphMargin: false,
                    folding: false,
                }}
            />
        </div>
    );
}