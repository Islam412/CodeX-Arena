<div align="center">

# 🚀 CodeX Arena

**A modern, responsive web-based code editor and execution engine with an Apple-inspired UI, bilingual Arabic/English interface, and real-time error reporting with line numbers.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://codex-arena-iota.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Islam412/CodeX-Arena/tree/main)

[Live Demo](https://codex-arena-iota.vercel.app/) · [Report Bug](https://github.com/Islam412/CodeX-Arena/issues) · [Request Feature](https://github.com/Islam412/CodeX-Arena/issues)

</div>

---

## 📸 Preview

## Html Css JS
![CodeX Arena Preview](img/1.png)

## JS
![CodeX Arena Preview](img/2.png)

---

## ✨ Features

- **🎨 Apple-inspired UI:** Clean typography, a restrained Apple color palette, hairline borders and light/dark themes.
- **Arabic / English Interface:** Switch languages from the header or settings. Error messages are always shown in both languages.
- **📁 Easy File & Folder Management:** Create files and folders inside any folder from the breadcrumb bar or inline row actions, then drag and drop items between folders and the project root.
- **🔍 Fast Search & Tree Filtering:** Search through your files instantly using quick search filters.
- **⚡ Smart Autocomplete & Syntax Highlighting:** Keywords, smart snippets and project words suggested while typing; `log` expands to `console.log();` with the cursor inside the parentheses, HTML tags open and close together, and `Ctrl+Space` opens suggestions manually.
- **VS Code-style Editing:** `Alt+Up` / `Alt+Down` move the current line or selection, and `Shift+Alt+Down` duplicates it.
- **New Project & Open Project:** Short starter templates (blank page, HTML/CSS/JS, Python, Markdown), asks for a project name and creates a file with that name, save the project as a JSON file, and open a saved project file or full folder.
- **Terminal Launcher:** Run `./codex` from any folder to open the editor in that folder; files and folders are auto-saved back to disk like a local VS Code workspace.
- **Planning Workspace:** Built-in to-do list and a drawing canvas for wireframing and app planning, with pen, eraser, colors, undo, clear and PNG export; saved with the project.
- **Help & Guide:** Searchable in-app guide covering editing, files, errors, inspect tools, planning, saving and language switching.
- **🛠️ Built-in Developer Tools:** Interactive JavaScript Console (REPL), Problems panel with exact line numbers and source snippets, plus a DOM Inspector with element picker, tree and computed styles.
- **🖱️ Custom Context Menus:** Native-feel right-click menus for quick file operations (Rename, Delete, Create).
- **Responsive Layout:** Sidebar drawer and full-screen output views on phones, with touch-friendly controls on tablets and desktops.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with Apple-inspired design tokens, responsive layouts and light/dark themes
- **Deployment & Hosting:** Vercel

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### Prerequisites

All you need is a modern web browser (Chrome, Firefox, Edge, Safari). For the terminal launcher you also need Node.js.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Islam412/CodeX-Arena.tree/main.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd CodeX-Arena
   ```

3. **Open the project:**
   Simply open `index.html` in your browser, or launch it using VS Code's **Live Server** extension.

### Terminal workflow

From the folder you want to work in:

```bash
/path/to/CodeX-Arena/codex
```

Or add an alias once:

```bash
alias codex="/path/to/CodeX-Arena/codex"
```

Then run `codex` inside any project folder. The app opens that folder as the project, and changes are written back to it automatically. A `Sync local folder` button and connection status appear in the status bar. To open one file directly, run `codex path/to/file.js`.

---

## 🌐 Live Demo

Check out the live interactive app here:  
👉 **[https://codex-arena-iota.vercel.app/](https://codex-arena-iota.vercel.app/)**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](https://github.com/Islam412/CodeX-Arena/issues).

---