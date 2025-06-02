import React, { useMemo, useState } from 'react'
import { Box, Typography, Card, CardContent, IconButton, Chip, Avatar, Menu, MenuItem } from '@mui/material'
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
import RenderContent from './common/RenderContent'
import { truncateHtmlContent, MAX_PREVIEW_LENGTH } from '@/utils/truncate'
import { NoteCardProps } from '@/models/types'

dayjs.extend(relativeTime)

const NoteCard = React.memo<NoteCardProps>(({ note, onEdit, onDelete, onShare, users }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit(note)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDelete(note.id)
    handleMenuClose()
  }

  const handleShare = () => {
    onShare(note.id)
    handleMenuClose()
  }

  const collaborators = useMemo(
    () => users.filter((user) => note.collaborators.includes(user.id)),
    [users, note.collaborators],
  )

  const previewContent = useMemo(() => {
    return truncateHtmlContent(note.content, MAX_PREVIEW_LENGTH)
  }, [note.content])

  const isHtmlContent = note.content.includes('<') && note.content.includes('>')
  const formattedDate = dayjs(note.createdAt).format('DD/MM/YYYY HH:mm:ss')

  return (
    <Card sx={cardStyles} onClick={handleEdit}>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='flex-start' mb={1}>
          <Typography variant='h6' component='h3' sx={titleStyles}>
            {note.title}
          </Typography>
          <IconButton size='small' onClick={handleMenuClick} sx={{ ml: 1, flexShrink: 0 }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {isHtmlContent ? (
          <RenderContent previewContent={previewContent} />
        ) : (
          <Typography variant='body2' color='text.secondary' sx={previewTextStyles}>
            {previewContent}
          </Typography>
        )}

        <Box display='flex' alignItems='center' gap={1} mb={1}>
          <ScheduleIcon fontSize='small' color='action' />
          <Typography variant='caption' color='text.secondary'>
            {formattedDate}
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
const cardStyles = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: 4,
  },
}

const titleStyles = {
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.3,
  flex: 1,
}

const previewTextStyles = {
  mb: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.5,
}

NoteCard.displayName = 'NoteCard'
export default NoteCard
