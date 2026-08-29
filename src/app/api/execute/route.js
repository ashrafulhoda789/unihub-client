import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { language, fileName, content } = body;

        // Language Mapping for OneCompiler
        const langMap = {
            "c++": "cpp",
            "c": "c",
            "java": "java",
            "python": "python",
            "javascript": "javascript"
        };

        const targetLang = langMap[language] || "javascript";

        // Call OneCompiler RapidAPI Endpoint
        const response = await fetch("https://onecompiler-apis.p.rapidapi.com/api/v1/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
                "x-rapidapi-key": "8bba62fb18msh225b2c5b8367e1ep1b142ajsn64c1efb71fe9"
            },
            body: JSON.stringify({
                language: targetLang,
                stdin: "",
                files: [
                    {
                        name: fileName || "index.py",
                        content: content
                    }
                ]
            })
        });

        const data = await response.json();

        // Extract Output
        return NextResponse.json({
            run: {
                stdout: data.stdout || "",
                stderr: data.stderr || data.exception || "",
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Execution failed: " + error.message },
            { status: 500 }
        );
    }
}