import React from 'react'
import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Warning as WarningIcon, Person as PersonIcon } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useNotesStore } from '@/provider/notesProvider'
import RenderContent from './RenderContent'
import { Conflict } from '@/models/notes'
import { getLatestOperationId } from '@/utils'

const ConflictModal = React.memo<{
  open: boolean
  conflicts: Conflict[]
  onResolve: (conflictId: string, resolution: string, selectedOperationId?: string) => void
  onClose: () => void
}>(({ open, conflicts, onResolve, onClose }) => {
  const users = useNotesStore((state) => state.users)

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : userId
  }

  const handleSelectOperation = (conflictId: string, operationId: string) => {
    onResolve(conflictId, 'manual', operationId)
    onClose()
  }

  const handleAutoResolve = (conflictId: string) => {
    const latestOperationId = getLatestOperationId(conflicts, conflictId)
    onResolve(conflictId, 'latest-wins', latestOperationId)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box display='flex' alignItems='center' gap={1}>
          <WarningIcon color='warning' />
          Editing Conflicts Detected
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Multiple users have edited this note simultaneously. Choose how to resolve the conflict:
        </Typography>

        {conflicts?.map((conflict) => (
          <Paper key={conflict.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant='subtitle2' gutterBottom>
              Conflict #{conflict.id.slice(-4)} - {conflict.operations.length} conflicting edits
            </Typography>

            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {conflict.operations.map((operation) => (
                <Box key={operation.id} sx={{ mb: 1 }}>
                  <Paper
                    variant='outlined'
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => handleSelectOperation(conflict.id, operation.id)}
                  >
                    <Box display='flex' alignItems='center' gap={1} mb={1}>
                      <PersonIcon fontSize='small' color='primary' />
                      <Typography variant='caption' color='text.secondary'>
                        User: {getUserName(operation.userId)} •{' '}
                        {dayjs(operation.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: 'grey.800',
                        p: 1,
                        borderRadius: 1,
                        fontSize: '0.85rem',
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }}
                    >
                      <RenderContent previewContent={operation?.content} />
                    </Box>
                    <Button
                      size='small'
                      variant='outlined'
                      sx={{ mt: 1 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectOperation(conflict.id, operation.id)
                      }}
                    >
                      Use This Edit
                    </Button>
                  </Paper>
                </Box>
              ))}
            </Box>

            <Box display='flex' gap={1} mt={2} justifyContent='center'>
              <Button variant='contained' color='warning' onClick={() => handleAutoResolve(conflict.id)}>
                Auto-Resolve (Use Latest)
              </Button>
            </Box>
          </Paper>
        ))}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
})

ConflictModal.displayName = 'ConflictModal'

export default ConflictModal
