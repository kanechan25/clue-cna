# 📝 CLUE - Collaborative Notes Application

A modern, real-time collaborative note-taking application built with **React 19**, **TypeScript**, **Zustand**, and **Tiptap**. Features intelligent conflict resolution, seamless collaboration simulation, and comprehensive testing coverage.

## ✨ Key Features

### 🏠 **Smart Note Management**

- **Rich Text Editor** with Tiptap (bold, italic, lists, formatting)
- **Real-time Search** across titles and content
- **Quick Creation** via header button, FAB, or empty state
- **Direct URL Access** to specific notes (`/note/note-id`)
- **Share Functionality** with clipboard integration

### 🤝 **Advanced Collaboration**

- **Multi-user Simulation** with realistic collaborative editing
- **Intelligent Conflict Detection** within 5-second windows
- **Manual & Auto Conflict Resolution** with user choice
- **Real-time Collaborator Presence** with avatars and status
- **Version Control** with automatic tracking

### 🎨 **Modern UI/UX**

- **Material-UI Design System** with dark/light theme support
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Performance Optimized** with lazy loading and memoization
- **Toast Notifications** for user feedback
- **Local Persistence** with localStorage integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kanechan25/clue-cna.git
   cd clue-cna
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   or
   npm install
   ```

3. **Start development server**

   ```bash
   pnpm run dev
   or
   npm run dev
   ```

Open [http://localhost:5178](http://localhost:5178) to view the application.

## 📋 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint with TypeScript rules
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting without changes

# Testing
pnpm test             # Run all tests (25 tests)
pnpm test:ui          # Interactive test UI
pnpm test:coverage    # Generate coverage reports
pnpm test:watch       # Watch mode for development
```

## 🏗️ Project Architecture

### 📁 **Project Structure**

```
src/
├── __test__/                    # Comprehensive test suite
│   ├── integrations/           # Integration tests (15 tests)
│   │   └── NoteCreationFlow.test.tsx  # Complete user flow testing
│   ├── units/                  # Unit tests (10 tests)
│   │   ├── Home.test.tsx       # Home page component tests
│   │   └── NoteEditorPage.test.tsx     # Editor component tests
│   ├── utils.tsx               # Shared testing utilities
│   └── setup.ts                # Test configuration
├── components/
│   ├── common/                 # Reusable components
│   │   ├── Header.tsx          # App header with search
│   │   ├── CreateNoteModal.tsx # Note creation modal
│   │   ├── ConflictModal.tsx   # Conflict resolution UI
│   │   ├── TiptapEditor.tsx    # Rich text editor
│   │   └── RenderContent.tsx   # Content renderer
│   ├── NoteCard.tsx           # Note display cards
│   └── CollaborativeEditor.tsx # Collaboration wrapper
├── pages/
│   ├── Home.tsx               # Notes listing and search
│   └── NoteEditorPage.tsx     # Note editing interface
├── stores/
│   └── notes.ts               # Zustand state management
├── provider/
│   ├── notesProvider.tsx      # Notes context provider
│   └── themeProvider.tsx      # Theme management
├── models/
│   ├── notes.ts               # TypeScript interfaces
│   └── types.ts               # Component type definitions
├── constants/
│   └── mockData.ts            # Mock data and users
└── utils/
    └── store.ts               # Utility functions
```

### 🔧 **Technology Stack**

**Core Technologies:**

- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Strict type safety
- **Vite 6** - Lightning-fast development and builds
- **Zustand 5** - Lightweight state management

**UI & Styling:**

- **Material-UI 7** - Complete design system
- **TailwindCSS** - Utility-first CSS framework
- **Tiptap 2.12** - Rich text editor built on ProseMirror
- **Emotion** - CSS-in-JS with theme integration

**Testing & Quality:**

- **Vitest** - Fast unit testing with coverage
- **React Testing Library** - Component testing utilities
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates

**Developer Experience:**

- **React Query** - Ready for server state management
- **dayjs** - Modern date manipulation
- **React Router** - Navigation and routing

## 🧪 Testing Architecture

### **Comprehensive Test Coverage (25 tests)**

```bash
✓ Integration Tests (15 tests)    # Complete user workflows
✓ Unit Tests (10 tests)          # Component isolation testing
```

**Integration Tests:**

- **Complete Note Creation Flow** - Button click → Modal → Store interaction
- **Header Functionality** - New Note button behavior across all entry points
- **Modal Behavior** - Form validation, submission, and state management
- **Store Integration** - Zustand store function calls and state updates
- **Toast Notifications** - User feedback and success messages

**Unit Tests:**

- **Home Page Rendering** - Component structure and content display
- **Note Editor** - Rich text editing and collaboration features
- **Search Functionality** - Real-time filtering and query handling

### **Testing Strategy**

```typescript
src/__test__/
├── integrations/    # End-to-end user workflows
│   └── NoteCreationFlow.test.tsx
├── units/          # Isolated component testing
│   ├── Home.test.tsx
│   └── NoteEditorPage.test.tsx
├── utils.tsx       # Shared testing utilities
└── setup.ts        # Global test configuration
```

**Key Testing Features:**

- **Mock Store Provider** for isolated state testing
- **Toast Notification Mocking** for user feedback validation
- **React Router Mocking** for navigation testing
- **Component Isolation** with proper dependency mocking

## 🎯 Usage Guide

### **Creating Notes**

1. **Header Button**: Click "New Note" in the navigation
2. **Empty State**: Click "Create Your First Note" when no notes exist
3. **Mobile FAB**: Use floating action button on mobile devices

### **Rich Text Editing**

- **Formatting**: Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U)
- **Lists**: Bullet points and numbered lists
- **Auto-save**: Changes save automatically after 1 second
- **Version Control**: Automatic version tracking with timestamps

### **Collaboration Features**

- **Simulate Collaboration**: Click button to trigger multi-user editing
- **Conflict Resolution**: Choose between conflicting edits or auto-resolve
- **Collaborator Management**: Add/remove collaborators via toolbar
- **Real-time Presence**: See active collaborators with status indicators

### **Advanced Features**

- **Direct URLs**: Navigate to `/note/note-id` for instant access
- **Search**: Real-time filtering across all note content
- **Sharing**: Copy shareable links via note card menu
- **Theme Toggle**: Switch between light and dark modes

## ⚡ Performance Features

### **React Optimizations**

- **React.memo** - Prevents unnecessary re-renders
- **useCallback/useMemo** - Memoized functions and calculations
- **Lazy Loading** - Dynamic imports for large components
- **Efficient Selectors** - Optimized Zustand store subscriptions

### **State Management**

- **Selective Updates** - Granular state changes
- **Operation Cleanup** - Automatic removal of old operations
- **Local Persistence** - Efficient localStorage integration
- **Conflict Batching** - Groups related operations together

## 🔮 Future Enhancements

### **Real-time Collaboration**

- WebSocket integration for live editing
- Operational transformation for conflict-free collaboration
- Real-time cursor positions and user presence
- Live commenting and annotation system

### **Advanced Features**

- Backend API integration with React Query
- User authentication and team workspaces
- Advanced editor features (tables, media uploads)
- Export functionality (Markdown, PDF)

## 🤝 Contributing

### **Development Workflow**

1. **Fork & Clone**: Create your own repository fork
2. **Install Dependencies**: `pnpm install`
3. **Create Branch**: Use descriptive names (`feature/new-editor-feature`)
4. **Run Tests**: Ensure all 25 tests pass with `pnpm test`
5. **Code Quality**: Run `pnpm lint` and `pnpm format`
6. **Pull Request**: Submit with detailed description

### **Coding Standards**

- **TypeScript**: Strict mode, comprehensive type safety
- **React**: Functional components with proper hook usage
- **Testing**: Maintain test coverage for new features
- **Styling**: Material-UI + TailwindCSS, no custom CSS
- **Git**: Conventional commits, atomic changes

## 📈 Project Status

- ✅ **Core Features**: Complete with rich text editing
- ✅ **Collaboration**: Advanced simulation with conflict resolution
- ✅ **Testing**: Comprehensive coverage (25 tests passing)
- ✅ **Performance**: Optimized for production use
- ✅ **Documentation**: Complete setup and usage guides
- 🔄 **Backend Integration**: Ready for API implementation
- 🔄 **Real-time Features**: Architecture prepared for WebSockets
