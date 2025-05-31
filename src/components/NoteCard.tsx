import React, { useMemo, useCallback, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Note } from '@/models/notes'
import RenderNote from './RenderNote'

dayjs.extend(relativeTime)

const MAX_PREVIEW_LENGTH = 250

// Lazy load the NoteEditorPage component
const lazyLoadNoteEditor = () => import('@/pages/NoteEditorPage').then((module) => module.NoteEditorPage)

// just preview MAX_PREVIEW_LENGTH characters of HTML content
const truncateHtmlContent = (html: string, maxLength: number = MAX_PREVIEW_LENGTH): string => {
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
  onShare: (id: string) => void
  users: Array<{ id: string; name: string; color: string }>
}>(({ note, onEdit, onDelete, onShare, users }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLazyLoading, setIsLazyLoading] = useState<boolean>(false)
  const open = Boolean(anchorEl)

  const handleMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleEdit = useCallback(async () => {
    if (isLazyLoading) return

    // Only lazy load if this is a large note
    if (note.isLargeNote) {
      setIsLazyLoading(true)
      try {
        // Pre-load the NoteEditorPage component
        await lazyLoadNoteEditor()

        // Small delay to show the loading effect
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Now navigate to the editor
        onEdit(note)
      } catch (error) {
        console.error('Failed to lazy load editor:', error)
        // Fallback: still navigate even if lazy loading fails
        onEdit(note)
      } finally {
        setIsLazyLoading(false)
      }
    } else {
      // Regular note - open immediately
      onEdit(note)
    }

    handleMenuClose()
  }, [note, onEdit, handleMenuClose, isLazyLoading])

  const handleDelete = useCallback(() => {
    onDelete(note.id)
    handleMenuClose()
  }, [note.id, onDelete, handleMenuClose])

  const handleShare = useCallback(() => {
    onShare(note.id)
    handleMenuClose()
  }, [note.id, onShare, handleMenuClose])

  const collaborators = useMemo(
    () => users.filter((user) => note.collaborators.includes(user.id)),
    [users, note.collaborators],
  )

  const previewContent = useMemo(() => {
    return truncateHtmlContent(note.content, MAX_PREVIEW_LENGTH)
  }, [note.content])

  const isHtmlContent = note.content.includes('<') && note.content.includes('>')

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: isLazyLoading ? 'wait' : 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        opacity: isLazyLoading ? 0.8 : 1,
        '&:hover': {
          transform: isLazyLoading ? 'none' : 'scale(1.05)',
          boxShadow: isLazyLoading ? 1 : 4,
        },
      }}
      onClick={handleEdit}
    >
      {/* Loading overlay */}
      {isLazyLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10,
            borderRadius: 1,
          }}
        >
          <CircularProgress size={32} />
          <Typography variant='caption' sx={{ mt: 1, color: 'text.secondary' }}>
            Loading...
          </Typography>
        </Box>
      )}

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
            {note.isLargeNote && (
              <Chip
                label='Large note'
                size='small'
                color='warning'
                variant='outlined'
                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
              />
            )}
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
            {dayjs(note.createdAt).format('DD/MM/YYYY HH:mm:ss')}
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
        <MenuItem onClick={handleShare}>
          <ShareIcon fontSize='small' sx={{ mr: 1 }} />
          Share
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
