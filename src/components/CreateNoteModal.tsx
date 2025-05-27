import React, { useCallback, useState } from 'react'
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

const CreateNoteDialog = React.memo<{
  open: boolean
  onClose: () => void
  onSubmit: (title: string, content: string) => void
}>(({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(title.trim(), content.trim())
      setTitle('')
      setContent('')
      onClose()
    }
  }, [title, content, onSubmit, onClose])

  const handleClose = useCallback(() => {
    setTitle('')
    setContent('')
    onClose()
  }, [onClose])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Create New Note</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Note Title'
          fullWidth
          variant='outlined'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin='dense'
          label='Content (optional)'
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={!title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
})

CreateNoteDialog.displayName = 'CreateNoteDialog'
export default CreateNoteDialog
