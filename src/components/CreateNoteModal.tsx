import React, { useCallback, useState } from 'react'
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material'
import TiptapEditor from './TiptapEditor'

const CreateNoteModal = React.memo<{
  open: boolean
  onClose: () => void
  onSubmit: (title: string, content: string) => void
}>(({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(title.trim(), content)
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
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
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
          sx={{ mb: 2, bgcolor: '#1e1e1e', borderRadius: 1 }}
        />
        <Box>
          <label className='text-sm font-medium'>Note Content</label>
          <TiptapEditor
            content={content}
            onUpdate={handleContentChange}
            placeholder='Start writing your note...'
            minHeight={200}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='contained'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={!title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
})

CreateNoteModal.displayName = 'CreateNoteModal'
export default CreateNoteModal
