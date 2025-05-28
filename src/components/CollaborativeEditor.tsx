import React, { useState, useCallback, useEffect } from 'react'
import { Box, Typography, Button, Avatar, Tooltip } from '@mui/material'
import { People as PeopleIcon } from '@mui/icons-material'
import dayjs from 'dayjs'
import { Note, User } from '@/models/notes'
import TiptapEditor from './TiptapEditor'

const CollaborativeEditor = React.memo<{
  note: Note
  onContentChange: (content: string) => void
  collaborators: User[]
}>(({ note, onContentChange, collaborators }) => {
  const [content, setContent] = useState(note.content)
  const [lastSaved, setLastSaved] = useState(Date.now())

  // Update content when note changes
  useEffect(() => {
    setContent(note.content)
  }, [note.content])

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

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  // Simulate collaborative editing
  const simulateCollaboratorEdit = useCallback(() => {
    const randomCollaborator = collaborators.find((c) => c.isActive && c.id !== note.lastEditedBy)
    if (randomCollaborator) {
      const collaboratorAddition = `<p><em>[${randomCollaborator.name} added a comment at ${dayjs().format('HH:mm')}]</em></p>`
      const newContent = content + collaboratorAddition
      setContent(newContent)
      onContentChange(newContent)
    }
  }, [collaborators, content, note.lastEditedBy, onContentChange])

  return (
    <Box>
      {/* Header with collaborator info and actions */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='caption' color='text.secondary'>
            Last saved: {dayjs(lastSaved).format('HH:mm:ss')}
          </Typography>
        </Box>

        <Box display='flex' alignItems='center' gap={1}>
          <Button variant='outlined' size='small' onClick={simulateCollaboratorEdit} startIcon={<PeopleIcon />}>
            Simulate Collaborator
          </Button>
        </Box>
      </Box>

      {/* Main Tiptap Editor */}
      <TiptapEditor
        content={content}
        onUpdate={handleContentChange}
        placeholder='Start writing your note...'
        minHeight={400}
        editable={true}
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
