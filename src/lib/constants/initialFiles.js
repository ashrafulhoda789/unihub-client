export const initialFiles = {
    "file-1": {
        id: "file-1",
        name: "main.c",
        isFolder: false,
        content: `#include <stdio.h>\n\nint main() {\n    printf("Hello C Language in IDE Sandbox!\\n");\n    return 0;\n}`,
        language: "c",
    },
    "file-2": {
        id: "file-2",
        name: "main.cpp",
        isFolder: false,
        content: `#include <iostream>\n\nint main() {\n    std::cout << "Hello C++ in IDE Sandbox!" << std::endl;\n    return 0;\n}`,
        language: "cpp",
    },
    "file-3": {
        id: "file-3",
        name: "Main.java",
        isFolder: false,
        content: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java in IDE Sandbox!");\n    }\n}`,
        language: "java",
    },
    "file-4": {
        id: "file-4",
        name: "script.py",
        isFolder: false,
        content: `print("Hello Python in IDE Sandbox!")`,
        language: "python",
    },
    "file-5": {
        id: "file-5",
        name: "index.js",
        isFolder: false,
        content: `console.log("Hello JavaScript!");`,
        language: "javascript",
    },
};