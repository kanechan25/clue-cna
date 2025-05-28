import React from 'react'
import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
const ConflictModal = React.memo<{
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

ConflictModal.displayName = 'ConflictModal'

export default ConflictModal
