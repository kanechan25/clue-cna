import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Box, Typography, TextField, Button, IconButton, Paper, Avatar, ButtonGroup, Tooltip } from '@mui/material'
import {
  People as PeopleIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { Note, User, FormatType } from '@/models/notes'

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

export default CollaborativeEditor
