import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  ButtonGroup,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemText,
  ListItemAvatar,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useNotesStore } from '@/provider/notesProvider'
import { Note, User, FormatType } from '@/models/notes'

// Rich Text Formatting Functions
const applyFormat = (text: string, selection: { start: number; end: number }, format: FormatType): string => {
  const selectedText = text.slice(selection.start, selection.end)
  const beforeText = text.slice(0, selection.start)
  const afterText = text.slice(selection.end)

  let formattedText = selectedText

  switch (format) {
    case 'bold':
      formattedText = `**${selectedText}**`
      break
    case 'italic':
      formattedText = `*${selectedText}*`
      break
    case 'underline':
      formattedText = `<u>${selectedText}</u>`
      break
    case 'bulletList':
      formattedText = selectedText
        .split('\n')
        .map((line) => (line.trim() ? `- ${line}` : line))
        .join('\n')
      break
    case 'numberedList':
      formattedText = selectedText
        .split('\n')
        .map((line, index) => (line.trim() ? `${index + 1}. ${line}` : line))
        .join('\n')
      break
    default:
      return text
  }

  return beforeText + formattedText + afterText
}

// Collaborative Editor Component
const CollaborativeEditor = React.memo<{
  note: Note
  onContentChange: (content: string) => void
  collaborators: User[]
}>(({ note, onContentChange, collaborators }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState(note.content)
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [lastSaved, setLastSaved] = useState(Date.now())

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== note.content) {
        onContentChange(content)
        setLastSaved(Date.now())
      }
    }, 1000) // Auto-save after 1 second of inactivity

    return () => clearTimeout(timer)
  }, [content, note.content, onContentChange])

  // Handle text selection changes
  const handleSelectionChange = useCallback(() => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      })
    }
  }, [])

  // Apply formatting to selected text
  const handleFormat = useCallback(
    (format: FormatType) => {
      if (textareaRef.current) {
        const newContent = applyFormat(content, selection, format)
        setContent(newContent)

        // Restore cursor position after formatting
        setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPos = selection.start + (newContent.length - content.length)
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
            textareaRef.current.focus()
          }
        }, 0)
      }
    },
    [content, selection],
  )

  // Simulate collaborative editing
  const simulateCollaboratorEdit = useCallback(() => {
    const randomCollaborator = collaborators.find((c) => c.isActive && c.id !== note.lastEditedBy)
    if (randomCollaborator) {
      const collaboratorAddition = `\n\n*[${randomCollaborator.name} added a comment at ${dayjs().format('HH:mm')}]*`
      const newContent = content + collaboratorAddition
      setContent(newContent)
      onContentChange(newContent)
    }
  }, [collaborators, content, note.lastEditedBy, onContentChange])

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault()
            handleFormat('bold')
            break
          case 'i':
            event.preventDefault()
            handleFormat('italic')
            break
          case 'u':
            event.preventDefault()
            handleFormat('underline')
            break
          case 's':
            event.preventDefault()
            onContentChange(content)
            setLastSaved(Date.now())
            break
        }
      }
    },
    [handleFormat, content, onContentChange],
  )

  return (
    <Box>
      {/* Formatting Toolbar */}
      <Paper
        elevation={1}
        sx={{
          p: 1,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <ButtonGroup size='small' variant='outlined'>
          <Tooltip title='Bold (Ctrl+B)'>
            <IconButton onClick={() => handleFormat('bold')}>
              <BoldIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Italic (Ctrl+I)'>
            <IconButton onClick={() => handleFormat('italic')}>
              <ItalicIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Underline (Ctrl+U)'>
            <IconButton onClick={() => handleFormat('underline')}>
              <UnderlineIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size='small' variant='outlined'>
          <Tooltip title='Bullet List'>
            <IconButton onClick={() => handleFormat('bulletList')}>
              <BulletListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Numbered List'>
            <IconButton onClick={() => handleFormat('numberedList')}>
              <NumberedListIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Button
          variant='outlined'
          size='small'
          onClick={simulateCollaboratorEdit}
          startIcon={<PeopleIcon />}
          sx={{ ml: 'auto' }}
        >
          Simulate Collaborator
        </Button>

        <Typography variant='caption' color='text.secondary'>
          Last saved: {dayjs(lastSaved).format('HH:mm:ss')}
        </Typography>
      </Paper>

      {/* Main Editor */}
      <TextField
        inputRef={textareaRef}
        fullWidth
        multiline
        minRows={20}
        maxRows={30}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSelect={handleSelectionChange}
        onKeyDown={handleKeyDown}
        placeholder='Start writing your note...'
        variant='outlined'
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '1rem',
            lineHeight: 1.6,
            fontFamily: 'monospace',
          },
        }}
      />

      {/* Active Collaborators */}
      {collaborators.length > 0 && (
        <Box display='flex' alignItems='center' gap={1} mt={2}>
          <Typography variant='body2' color='text.secondary'>
            Active collaborators:
          </Typography>
          {collaborators.map((collaborator) => (
            <Tooltip key={collaborator.id} title={collaborator.name}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.8rem',
                  bgcolor: collaborator.color,
                  border: collaborator.isActive ? '2px solid #4caf50' : 'none',
                }}
              >
                {collaborator.name[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Box>
      )}
    </Box>
  )
})

CollaborativeEditor.displayName = 'CollaborativeEditor'

// Conflict Resolution Dialog
const ConflictDialog = React.memo<{
  open: boolean
  conflicts: Array<{ id: string; operations: any[] }>
  onResolve: (conflictId: string, resolution: string) => void
  onClose: () => void
}>(({ open, conflicts, onResolve, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box display='flex' alignItems='center' gap={1}>
          <WarningIcon color='warning' />
          Editing Conflicts Detected
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' paragraph>
          Multiple users are editing this note simultaneously. Choose how to resolve conflicts:
        </Typography>

        {conflicts.map((conflict) => (
          <Paper key={conflict.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant='subtitle2' gutterBottom>
              Conflict #{conflict.id.slice(-4)}
            </Typography>
            <Typography variant='body2' color='text.secondary' paragraph>
              {conflict.operations.length} conflicting operations detected
            </Typography>
            <Box display='flex' gap={1}>
              <Button size='small' variant='outlined' onClick={() => onResolve(conflict.id, 'latest-wins')}>
                Use Latest Changes
              </Button>
              <Button size='small' variant='outlined' onClick={() => onResolve(conflict.id, 'auto-merge')}>
                Auto Merge
              </Button>
            </Box>
          </Paper>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
})

ConflictDialog.displayName = 'ConflictDialog'

// Main Note Editor Page
export const NoteEditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { noteId } = useParams<{ noteId: string }>()

  // State
  const [title, setTitle] = useState('')
  const [collaboratorMenuAnchor, setCollaboratorMenuAnchor] = useState<null | HTMLElement>(null)
  const [showConflicts, setShowConflicts] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  // Store selectors
  const currentNote = useNotesStore((state) => state.notes.find((note) => note.id === noteId) || state.currentNote)
  const users = useNotesStore((state) => state.users)
  const currentUser = useNotesStore((state) => state.currentUser)
  const conflicts = useNotesStore((state) => state.conflicts.filter((c) => c.noteId === noteId && !c.resolvedAt))

  // Store actions
  const updateNote = useNotesStore((state) => state.updateNote)
  const addCollaborator = useNotesStore((state) => state.addCollaborator)
  const removeCollaborator = useNotesStore((state) => state.removeCollaborator)
  const resolveConflict = useNotesStore((state) => state.resolveConflict)
  const addEditOperation = useNotesStore((state) => state.addEditOperation)
  const simulateCollaboratorEdit = useNotesStore((state) => state.simulateCollaboratorEdit)

  // Initialize note data
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
    } else if (noteId) {
      // If note not found, redirect to home
      navigate('/')
    }
  }, [currentNote, noteId, navigate])

  // Handle conflicts
  useEffect(() => {
    if (conflicts.length > 0) {
      setShowConflicts(true)
    }
  }, [conflicts])

  // Get collaborators for current note
  const collaborators = useMemo(() => {
    if (!currentNote) return []
    return users.filter((user) => currentNote.collaborators.includes(user.id) && user.id !== currentUser?.id)
  }, [currentNote, users, currentUser])

  // Available users to add as collaborators
  const availableCollaborators = useMemo(() => {
    if (!currentNote) return []
    return users.filter((user) => !currentNote.collaborators.includes(user.id))
  }, [currentNote, users])

  // Handlers
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.target.value
      setTitle(newTitle)

      if (currentNote) {
        updateNote(currentNote.id, { title: newTitle })
      }
    },
    [currentNote, updateNote],
  )

  const handleContentChange = useCallback(
    (content: string) => {
      if (!currentNote) return

      setSaveStatus('saving')

      // Add edit operation for tracking
      addEditOperation({
        noteId: currentNote.id,
        userId: currentUser?.id || 'anonymous',
        operation: 'insert',
        position: content.length,
        content: content.slice(-50), // Last 50 characters
        version: currentNote.version,
      })

      // Update note
      updateNote(currentNote.id, { content })

      setSaveStatus('saved')
    },
    [currentNote, currentUser, addEditOperation, updateNote],
  )

  const handleAddCollaborator = useCallback(
    (userId: string) => {
      if (currentNote) {
        addCollaborator(currentNote.id, userId)
      }
      setCollaboratorMenuAnchor(null)
    },
    [currentNote, addCollaborator],
  )

  const handleRemoveCollaborator = useCallback(
    (userId: string) => {
      if (currentNote) {
        removeCollaborator(currentNote.id, userId)
      }
    },
    [currentNote, removeCollaborator],
  )

  const handleResolveConflict = useCallback(
    (conflictId: string, resolution: string) => {
      resolveConflict(conflictId, resolution as any)
    },
    [resolveConflict],
  )

  const handleSimulateEdit = useCallback(() => {
    if (currentNote) {
      const randomText = [
        'Great point!',
        'I agree with this approach.',
        'Maybe we should consider...',
        'Added some thoughts here.',
        'This looks good to me.',
      ]
      const addition = `\n\n${randomText[Math.floor(Math.random() * randomText.length)]}`
      simulateCollaboratorEdit(currentNote.id, currentNote.content + addition)
    }
  }, [currentNote, simulateCollaboratorEdit])

  if (!currentNote) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
        <Typography variant='h6' color='text.secondary'>
          Note not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      {/* App Bar */}
      <AppBar position='sticky' color='inherit' elevation={1}>
        <Toolbar>
          <IconButton edge='start' onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>

          <TextField
            value={title}
            onChange={handleTitleChange}
            placeholder='Note title...'
            variant='standard'
            sx={{
              flexGrow: 1,
              mr: 2,
              '& .MuiInput-root': {
                fontSize: '1.25rem',
                fontWeight: 500,
              },
            }}
            InputProps={{
              disableUnderline: true,
            }}
          />

          <Box display='flex' alignItems='center' gap={1}>
            {/* Save Status */}
            <Chip
              size='small'
              label={saveStatus}
              color={saveStatus === 'saved' ? 'success' : saveStatus === 'saving' ? 'default' : 'error'}
              variant='outlined'
            />

            {/* Collaborators */}
            <Tooltip title='Manage collaborators'>
              <IconButton onClick={(e) => setCollaboratorMenuAnchor(e.currentTarget)}>
                <PeopleIcon />
              </IconButton>
            </Tooltip>

            {/* Conflicts indicator */}
            {conflicts.length > 0 && (
              <Tooltip title={`${conflicts.length} conflicts`}>
                <IconButton onClick={() => setShowConflicts(true)} color='warning'>
                  <WarningIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* Version info */}
            <Tooltip title={`Version ${currentNote.version} • Updated ${dayjs(currentNote.updatedAt).fromNow()}`}>
              <IconButton>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <CollaborativeEditor note={currentNote} onContentChange={handleContentChange} collaborators={collaborators} />
      </Container>

      {/* Collaborator Menu */}
      <Menu
        anchorEl={collaboratorMenuAnchor}
        open={Boolean(collaboratorMenuAnchor)}
        onClose={() => setCollaboratorMenuAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant='subtitle2'>Current Collaborators</Typography>
        </MenuItem>
        {collaborators.map((collaborator) => (
          <MenuItem key={collaborator.id}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: collaborator.color, width: 32, height: 32 }}>{collaborator.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={collaborator.name} />
            <Button size='small' onClick={() => handleRemoveCollaborator(collaborator.id)}>
              Remove
            </Button>
          </MenuItem>
        ))}

        {availableCollaborators.length > 0 && (
          <>
            <MenuItem disabled>
              <Typography variant='subtitle2'>Add Collaborators</Typography>
            </MenuItem>
            {availableCollaborators.map((user) => (
              <MenuItem key={user.id} onClick={() => handleAddCollaborator(user.id)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: user.color, width: 32, height: 32 }}>{user.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <PersonAddIcon fontSize='small' />
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      {/* Conflict Resolution Dialog */}
      <ConflictDialog
        open={showConflicts}
        conflicts={conflicts}
        onResolve={handleResolveConflict}
        onClose={() => setShowConflicts(false)}
      />

      {/* Development Helper */}
      <Button
        variant='outlined'
        onClick={handleSimulateEdit}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          display: { xs: 'none', md: 'flex' },
        }}
        startIcon={<PeopleIcon />}
      >
        Simulate Edit
      </Button>
    </Box>
  )
}
