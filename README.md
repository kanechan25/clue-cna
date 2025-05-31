# CLUE - Collaborative Notes App

A modern, real-time collaborative note-taking application built with React, TypeScript, Zustand, and Material-UI. This app allows multiple users to create, edit, and share notes simultaneously with conflict resolution and real-time updates.

## ✨ Features

### 🏠 Home Screen

- **📝 Note List**: Display all user-created notes with timestamps and preview
- **🔍 Real-time Search**: Search notes by title and content
- **➕ Quick Create**: Create new notes with title and content
- **🗑️ Delete & Share**: Manage notes with context menu actions
- **👥 Collaborator Indicators**: See who's working on each note
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop

### ✏️ Note Editor

- **🎨 Rich Text Formatting**: Bold, italic, underline, lists
- **⌨️ Keyboard Shortcuts**: Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+S
- **💾 Auto-save**: Automatic saving every second of inactivity
- **👥 Real-time Collaboration**: Multiple users can edit simultaneously
- **⚡ Conflict Resolution**: Automatic detection and resolution of editing conflicts
- **🏷️ Version Control**: Track note versions and edit history

### 🎨 User Experience

- **🌓 Dark/Light Theme**: Toggle between themes with smooth transitions
- **📱 Mobile-First**: Responsive design with touch-friendly interfaces
- **🚀 Performance Optimized**: Memoization, lazy loading, and efficient re-renders
- **💾 Local Storage**: Persistent data storage in browser
- **🔔 Toast Notifications**: Real-time feedback for user actions

### 🤝 Collaboration Features

- **👥 Multi-user Support**: Simulate collaborative editing
- **🎯 Conflict Detection**: Real-time conflict detection within 5 seconds
- **🔄 Auto-resolution**: Latest-wins and auto-merge strategies
- **📊 Operation Tracking**: Track all edit operations with timestamps
- **🧹 Performance Cleanup**: Automatic cleanup of old operations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/kanechan25/clue-cna.git
cd clue-cna
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start development server**

```bash
pnpm dev
```

4. **Open in browser**
   Navigate to `http://localhost:5178`

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
pnpm test:watch       # Run tests in watch mode
```

## 🏗️ Architecture

### 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # App header with navigation
│   ├── NoteCard.tsx    # Note display card
│   └── CreateNoteModal.tsx
├── pages/              # Main application pages
│   ├── Home.tsx        # Notes list page
│   └── NoteEditorPage.tsx # Note editing page
├── stores/             # Zustand state management
│   └── notes.ts        # Notes store with collaboration logic
├── models/             # TypeScript type definitions
│   └── notes.ts        # Note, User, and operation types
├── provider/           # React context providers
│   ├── notesProvider.tsx    # Notes state provider
│   └── themeProvider.tsx    # Theme context provider
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── test/               # Test files
└── assets/             # Static assets
```

### 🔧 Technology Stack

**Frontend Framework**

- **React 19** - Modern React with latest features
- **TypeScript 5.7** - Type safety and developer experience
- **Vite 6** - Fast build tool and dev server

**UI & Styling**

- **Material-UI 7** - Comprehensive component library
- **Emotion** - CSS-in-JS styling solution
- **Responsive Design** - Mobile-first approach

**State Management**

- **Zustand 5** - Lightweight state management
- **Vanilla Store** - For provider pattern implementation
- **Local Storage** - Persistent data storage

**Development Tools**

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Vitest** - Fast unit testing
- **Testing Library** - Component testing utilities

## 🎯 Usage Guide

### Creating Notes

1. Click the "New Note" button in the header
2. Enter a title and optional content
3. Click "Create" to save the note
4. The note appears in your notes list

### Editing Notes

1. Click on any note card to open the editor
2. Edit the title directly in the header
3. Use the formatting toolbar for rich text
4. Changes auto-save every second
5. Use keyboard shortcuts for quick formatting

### Collaboration Simulation

1. Open a note in the editor
2. Click "Simulate Collaborator" to see real-time editing
3. Conflicts are automatically detected and resolved
4. See collaborator avatars and activity indicators

### Theme Switching

- Click the theme toggle button in the header
- Switches between light and dark modes
- Preference is remembered for your session

## 🔧 Configuration

### Customizing Mock Data

Edit `src/model/mockData.ts` to modify:

- Initial notes content
- Mock users and colors

## 🧪 Testing

The app includes comprehensive tests for key components and functionality:

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test Header.test.tsx

# Run tests with coverage
pnpm test:coverage
```

**Test Coverage Includes:**

- Component rendering and interaction
- User event handling
- State management and updates
- Search and filtering functionality
- Theme switching
- Responsive design elements

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#1976d2) - Actions and links
- **Secondary**: Green (#388e3c) - Success states
- **Background**: Adaptive based on theme
- **Text**: High contrast for accessibility

### Typography

- **Font Family**: Roboto, Helvetica, Arial
- **Headings**: Weight 500-600, responsive sizing
- **Body Text**: 1rem base with 1.5 line height

### Component Guidelines

- **Cards**: 12px border radius with elevation
- **Buttons**: 8px border radius, no text transform
- **Forms**: Consistent spacing and validation
- **Responsive**: Mobile-first breakpoints

## 🚀 Performance Optimizations

### React Optimizations

- **React.memo** - Prevent unnecessary re-renders
- **useCallback** - Memoize event handlers
- **useMemo** - Cache expensive calculations
- **Lazy Loading** - Load components on demand

### State Management

- **Selective Updates** - Only update changed data
- **Operation Batching** - Group related state changes
- **Cleanup Jobs** - Remove old operations automatically
- **Local Storage** - Efficient serialization

### UI Performance

- **Virtualization** - For large note lists (future enhancement)
- **Debouncing** - Search and auto-save inputs
- **Efficient Re-renders** - Optimized selector functions
- **Image Optimization** - SVG logos and icons

## 🔮 Future Enhancements

### Collaboration Features

- **Real WebSocket Integration** - True real-time collaboration
- **User Presence** - Live cursor positions and selections
- **Comment System** - Threaded discussions on notes
- **Permission Management** - Read/write access controls

### Editor Improvements

- **WYSIWYG Editor** - Rich text with visual formatting
- **Markdown Support** - Native markdown rendering
- **File Attachments** - Images and document uploads
- **Version History** - Visual diff and restore capability

### Advanced Features

- **Cloud Sync** - Backend integration with databases
- **Offline Support** - Progressive Web App capabilities
- **Export Options** - PDF, Markdown, HTML exports
- **Template System** - Pre-built note templates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new components
- Use semantic commit messages
- Follow the existing code style
- Update documentation for new features

## 🙏 Acknowledgments

- **Material-UI** - For the excellent component library
- **Zustand** - For lightweight state management
- **Vite** - For the fast development experience
- **React Testing Library** - For reliable testing utilities

---
