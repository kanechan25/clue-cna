import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useNotesStore } from '@/provider/notesProvider'
import ConflictModal from '@/components/ConflictModal'
import CollaborativeEditor from '@/components/CollaborativeEditor'

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
        content: content.slice(-50),
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

        {availableCollaborators?.length > 0 && (
          <div>
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
          </div>
        )}
      </Menu>

      {/* Conflict Resolution Dialog */}
      <ConflictModal
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
