import React, { useMemo, useCallback, useState } from 'react'
import { Box, Typography, Card, CardContent, IconButton, Chip, Avatar, Menu, MenuItem } from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  ContentCopy as CopyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Note } from '@/models/notes'
import RenderNote from './RenderNote'

dayjs.extend(relativeTime)

// just preview 150 characters of HTML content
const truncateHtmlContent = (html: string, maxLength: number = 150): string => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  const textContent = tempDiv.textContent || tempDiv.innerText || ''

  if (textContent.length <= maxLength) {
    return html
  }

  const truncatedText = textContent.slice(0, maxLength)
  const lastSpaceIndex = truncatedText.lastIndexOf(' ')
  const finalLength = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength

  return textContent.slice(0, finalLength) + '...'
}

const NoteCard = React.memo<{
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  users: Array<{ id: string; name: string; color: string }>
}>(({ note, onEdit, onDelete, onDuplicate, users }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleEdit = useCallback(() => {
    onEdit(note)
    handleMenuClose()
  }, [note, onEdit, handleMenuClose])

  const handleDelete = useCallback(() => {
    onDelete(note.id)
    handleMenuClose()
  }, [note.id, onDelete, handleMenuClose])

  const handleDuplicate = useCallback(() => {
    onDuplicate(note.id)
    handleMenuClose()
  }, [note.id, onDuplicate, handleMenuClose])

  const collaborators = useMemo(
    () => users.filter((user) => note.collaborators.includes(user.id)),
    [users, note.collaborators],
  )

  const previewContent = useMemo(() => {
    return truncateHtmlContent(note.content, 150)
  }, [note.content])

  const isHtmlContent = note.content.includes('<') && note.content.includes('>')

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 4,
        },
      }}
      onClick={handleEdit}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='flex-start' mb={1}>
          <Typography
            variant='h6'
            component='h3'
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {note.title}
          </Typography>
          <IconButton size='small' onClick={handleMenuClick} sx={{ ml: 1, flexShrink: 0 }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {isHtmlContent ? (
          <RenderNote previewContent={previewContent} />
        ) : (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
            }}
          >
            {previewContent}
          </Typography>
        )}

        <Box display='flex' alignItems='center' gap={1} mb={1}>
          <ScheduleIcon fontSize='small' color='action' />
          <Typography variant='caption' color='text.secondary'>
            {dayjs(note.updatedAt).fromNow()}
          </Typography>
        </Box>

        {collaborators.length > 0 && (
          <Box display='flex' alignItems='center' gap={1}>
            <GroupIcon fontSize='small' color='action' />
            <Box display='flex' gap={0.5}>
              {collaborators.slice(0, 3).map((collaborator) => (
                <Avatar
                  key={collaborator.id}
                  sx={{
                    width: 20,
                    height: 20,
                    fontSize: '0.7rem',
                    bgcolor: collaborator.color,
                  }}
                >
                  {collaborator.name[0]}
                </Avatar>
              ))}
              {collaborators.length > 3 && (
                <Chip label={`+${collaborators.length - 3}`} size='small' sx={{ height: 20, fontSize: '0.7rem' }} />
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize='small' sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <CopyIcon fontSize='small' sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize='small' sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  )
})

NoteCard.displayName = 'NoteCard'
export default NoteCard
