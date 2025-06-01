# CLUE - Collaborative Notes App

A modern, real-time collaborative note-taking application built with React 19, TypeScript, Zustand, Material-UI, and Tiptap rich text editor. This app allows multiple users to create, edit, and share notes simultaneously with intelligent conflict resolution and seamless real-time collaboration simulation.

## ✨ Features

### 🏠 Home Screen

- **📝 Note Gallery**: Beautiful card-based display of all notes with rich content previews
- **🔍 Real-time Search**: Instant search across note titles and content with live filtering
- **➕ Quick Creation**: Create new notes with rich text content using modal dialog
- **🔗 Share Functionality**: Copy shareable links to clipboard for easy note sharing
- **🗑️ Note Management**: Delete notes with confirmation and context menu actions
- **👥 Collaborator Visualization**: See active collaborators with colored avatars
- **🏷️ Large Note Indicators**: Visual badges for notes requiring lazy loading
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop with touch gestures

### ✏️ Note Editor (Tiptap Rich Text)

- **🎨 Rich Text Formatting**: Full WYSIWYG editor with bold, italic, underline, bullet lists, numbered lists
- **🔧 Interactive Toolbar**: Visual formatting toolbar with undo/redo functionality
- **⌨️ Keyboard Shortcuts**: Standard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U) for power users
- **💾 Auto-save**: Intelligent auto-save every 1 second with save status indicators
- **📝 Live Title Editing**: Edit note titles directly in the editor header
- **🔄 Version Control**: Automatic version tracking with timestamps and user attribution
- **📐 Adaptive Layout**: Responsive editor that works seamlessly across all devices

### 🤝 Advanced Collaboration

- **👥 Multi-user Simulation**: Realistic collaborative editing simulation with multiple mock users
- **⚡ Smart Conflict Detection**: Intelligent conflict detection within 5-second windows
- **🎯 Manual Conflict Resolution**: Interactive conflict resolution with user choice selection
- **🔄 Auto-resolve Options**: One-click auto-resolution with latest-wins strategy
- **📊 Operation Tracking**: Comprehensive edit operation logging with timestamps and user attribution
- **🧹 Performance Optimization**: Automatic cleanup of old operations and conflicts
- **👁️ Visual Collaborator Presence**: Real-time collaborator avatars with active status indicators

### 🚀 Performance & UX

- **⚡ Lazy Loading**: Conditional lazy loading for large notes with visual loading indicators
- **🌓 Theme Support**: Complete dark/light theme switching with smooth transitions
- **💾 Local Persistence**: Reliable localStorage integration with data recovery
- **🔔 Toast Notifications**: Real-time user feedback for all actions with contextual messages
- **📱 Mobile-First**: Touch-optimized interface with gesture support
- **🔍 Direct URL Access**: Deep linking support - navigate directly to notes via URLs
- **⚡ React Optimizations**: Comprehensive memoization, useCallback, and useMemo implementation

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** (recommended) or npm/yarn
- Modern web browser with localStorage support

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
   ```
   http://localhost:5178
   ```

### Available Commands

```bash
# Development
pnpm dev              # Start development server on port 5178
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint with TypeScript rules
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting without changes

# Testing
pnpm test             # Run Vitest unit tests
pnpm test:ui          # Run tests with interactive UI
pnpm test:coverage    # Generate test coverage reports
pnpm test:watch       # Run tests in watch mode
```

## 🏗️ Architecture Overview

### 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Header.tsx          # App header with search and navigation
│   ├── NoteCard.tsx        # Note display cards with lazy loading
│   ├── CreateNoteModal.tsx # Rich text note creation modal
│   ├── ConflictModal.tsx   # Intelligent conflict resolution UI
│   ├── TiptapEditor.tsx    # Rich text editor with formatting
│   ├── CollaborativeEditor.tsx # Collaborative editing wrapper
│   └── RenderNote.tsx      # HTML content renderer
├── pages/                  # Main application pages
│   ├── Home.tsx           # Notes listing and search page
│   └── NoteEditorPage.tsx # Full-featured note editing interface
├── stores/                 # Zustand state management
│   └── notes.ts           # Complete notes store with collaboration logic
├── models/                 # TypeScript type definitions
│   └── notes.ts           # Interfaces for Note, User, EditOperation, Conflict
├── constants/              # Application constants
│   └── mockData.ts        # Mock users and initial notes data
├── provider/               # React context providers
│   ├── notesProvider.tsx  # Notes state provider wrapper
│   └── themeProvider.tsx  # Material-UI theme provider
├── utils/                  # Utility functions
│   └── index.ts           # Helper functions for content processing
└── hooks/                  # Custom React hooks
    └── index.ts           # Reusable hooks (future extensibility)
```

### 🔧 Technology Stack

**Core Framework**

- **React 19** - Latest React with concurrent features and optimizations
- **TypeScript 5.7** - Strict type safety with advanced inference
- **Vite 6** - Lightning-fast development with HMR and optimized builds

**UI & Styling**

- **Material-UI 7** - Complete design system with theming
- **TailwindCSS 4** - Utility-first CSS with custom configuration
- **Emotion** - CSS-in-JS with theme integration
- **Tiptap 2.12** - Extensible rich text editor built on ProseMirror

**State & Data Management**

- **Zustand 5** - Lightweight state management with subscriptions
- **React Query 5** - Server state management (ready for future API integration)
- **dayjs** - Modern date manipulation and formatting
- **Local Storage** - Client-side persistence with error handling

**Developer Experience**

- **ESLint** - Code quality with TypeScript and React rules
- **Prettier** - Consistent code formatting
- **Husky** - Git hooks for code quality enforcement
- **Vitest** - Fast unit testing with coverage reports

## 🎯 Detailed Usage Guide

### Creating Your First Note

1. **From the Header**: Click the "New Note" button in the top navigation
2. **From FAB (Mobile)**: Use the floating action button on mobile devices
3. **From Empty State**: Click "Create Your First Note" when no notes exist

**Rich Text Creation Process:**

- Enter a descriptive title
- Use the Tiptap editor for rich content:
  - **Bold**: Ctrl+B or toolbar button
  - **Italic**: Ctrl+I or toolbar button
  - **Underline**: Ctrl+U or toolbar button
  - **Bullet Lists**: Toolbar button or typing "- "
  - **Numbered Lists**: Toolbar button or typing "1. "
  - **Undo/Redo**: Toolbar buttons or Ctrl+Z/Ctrl+Y

### Advanced Note Editing

1. **Direct Access**: Type URLs like `/note/note-1` for instant navigation
2. **Lazy Loading**: Large notes show loading spinner before opening
3. **Auto-save**: Changes save automatically after 1 second of inactivity
4. **Save Status**: Visual indicators show "saving" → "auto saved" status
5. **Version Tracking**: Each edit increments version number with timestamps

### Collaboration Features

**Simulating Real-time Collaboration:**

1. Open any note in the editor
2. Click "Simulate Collaboration" button
3. Watch multiple users make simultaneous edits
4. Observe conflict detection and resolution options

**Managing Collaborators:**

1. Click the "People" icon in the editor toolbar
2. Add new collaborators from the user list
3. Remove existing collaborators as needed
4. See active collaborator avatars with status indicators

**Conflict Resolution:**

- **Automatic Detection**: Conflicts detected within 5-second windows
- **Manual Resolution**: Choose which user's edit to keep
- **Auto-resolve**: One-click resolution using latest edit
- **Visual Preview**: See full content of conflicting edits before choosing

### Sharing & Organization

**Share Notes:**

1. Click the "⋮" menu on any note card
2. Select "Share" to copy link to clipboard
3. Share the URL with collaborators for instant access

**Search & Filter:**

- Use the search bar for real-time filtering
- Search works across both titles and content
- Results update instantly as you type
- Clear search to return to full note list

### Advanced Features

**Large Note Performance:**

- Notes marked as "Large note" trigger lazy loading
- Visual loading indicators during component loading
- Optimized for heavy content and complex formatting

**Theme Switching:**

- Toggle between light and dark themes
- Preference persisted across browser sessions
- Smooth transitions and consistent color schemes

**Direct URL Navigation:**

- Bookmark specific notes with URLs like `/note/note-id`
- Share direct links to specific notes
- Automatic redirection if note doesn't exist

## 🔧 Configuration & Customization

### Mock Data Configuration

Edit `src/constants/mockData.ts` to customize:

**Users Configuration:**

```typescript
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Your Name',
    color: '#1976d2',
    isActive: true,
    lastActivity: new Date().toISOString(),
  },
  // Add more users...
]
```

**Initial Notes:**

```typescript
export const createMockNotes = (): Note[] => [
  {
    id: 'note-1',
    title: 'Your Note Title',
    content: `<p>Rich HTML content here</p>`,
    isLargeNote: false, // Set to true for lazy loading
    // ... other properties
  },
]
```

**Collaboration Messages:**

```typescript
export const randomCommentText = [
  'Your custom collaboration message',
  'Add context-specific suggestions',
  // ... more messages
]
```

## 🧪 Testing & Quality Assurance

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Watch mode for development
pnpm test:watch
```

### Test Coverage Areas

- **Component Rendering**: All major components tested for proper rendering
- **User Interactions**: Event handlers, form submissions, and navigation
- **State Management**: Zustand store actions and state updates
- **Search Functionality**: Real-time filtering and query handling
- **Collaboration Logic**: Conflict detection and resolution flows
- **Performance Features**: Lazy loading and memoization effectiveness

### Code Quality Tools

**ESLint Configuration:**

- TypeScript strict rules
- React hooks validation
- Prettier integration
- Custom naming conventions

**Git Hooks (Husky):**

- Pre-commit formatting
- Pre-commit linting
- Prevents commits with errors

## 🚀 Performance Optimizations

### React Optimizations

- **React.memo**: Prevents unnecessary component re-renders
- **useCallback**: Memoizes event handlers and functions
- **useMemo**: Caches expensive calculations and derived values
- **Lazy Loading**: Dynamic imports for large note components

### State Management Efficiency

- **Selective Updates**: Only updates changed data in Zustand store
- **Operation Batching**: Groups related state changes together
- **Cleanup Automation**: Removes old operations and conflicts automatically
- **Local Storage**: Efficient serialization and persistence

### UI Performance Features

- **Virtualization Ready**: Architecture supports future list virtualization
- **Debounced Search**: Search input optimization for large datasets
- **Efficient Re-renders**: Optimized selectors prevent cascading updates
- **Image Optimization**: Uses SVG icons and optimized assets

## 🔮 Architecture for Future Enhancements

### Backend Integration Ready

The current architecture is designed for easy backend integration:

- **API Layer**: Service layer prepared for REST/GraphQL APIs
- **React Query**: Already configured for server state management
- **Type Safety**: Complete TypeScript interfaces for network requests
- **Error Handling**: Robust error boundaries and fallback states

### Planned Enhancements

**Real Collaboration:**

- WebSocket integration for live collaboration
- Operational transformation for conflict-free editing
- Real-time cursor positions and user presence
- Live commenting and annotation system

**Advanced Editor Features:**

- Block-based editing with drag-and-drop
- Media uploads and attachment support
- Table editing and advanced formatting
- Markdown import/export functionality

**Enterprise Features:**

- User authentication and authorization
- Team workspace management
- Permission-based access controls
- Advanced analytics and insights

## 🤝 Contributing

### Development Workflow

1. **Fork and Clone**: Create your own fork of the repository
2. **Create Branch**: Use descriptive branch names (`feature/new-editor-feature`)
3. **Development**: Follow TypeScript strict mode and ESLint rules
4. **Testing**: Add tests for new features and maintain coverage
5. **Documentation**: Update README for significant changes
6. **Pull Request**: Create detailed PR with description and screenshots

### Coding Standards

- **TypeScript**: Use strict mode, avoid `any` types
- **React**: Functional components with proper hook usage
- **Styling**: TailwindCSS + Material-UI, no custom CSS files
- **Testing**: Jest/Vitest with React Testing Library
- **Git**: Conventional commit messages, atomic commits

### Project Structure Guidelines

- **Components**: Single responsibility, reusable, properly typed
- **Hooks**: Custom hooks for shared logic extraction
- **Stores**: Zustand slices for feature-specific state
- **Types**: Comprehensive TypeScript interfaces and enums
- **Utils**: Pure functions with unit tests

## Additional recommendations

- Use react-window or react-virtualize for large-lists (100+ notes)

## 🙏 Acknowledgments

- **Material-UI Team** - For the comprehensive design system and components
- **Zustand** - For the lightweight and powerful state management solution
- **Tiptap** - For the extensible and feature-rich rich text editor
- **Vite Team** - For the incredible development experience and build performance
- **React Team** - For the robust foundation and continuous innovation

---

**Built with ❤️ for collaborative productivity and seamless note-taking experiences.**
