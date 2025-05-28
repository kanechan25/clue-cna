import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Box, IconButton, Divider, Paper } from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
} from '@mui/icons-material'

interface TiptapEditorProps {
  content?: string
  onUpdate?: (html: string) => void
  placeholder?: string
  editable?: boolean
  minHeight?: number
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = '',
  onUpdate,
  placeholder = 'Start typing...',
  editable = true,
  minHeight = 200,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
      }),
      Underline,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onUpdate?.(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: `min-height: ${minHeight}px; padding: 16px;`,
        'data-placeholder': placeholder,
      },
    },
  })

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run()
  }, [editor])

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run()
  }, [editor])

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run()
  }, [editor])

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run()
  }, [editor])

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run()
  }, [editor])

  const undo = useCallback(() => {
    editor?.chain().focus().undo().run()
  }, [editor])

  const redo = useCallback(() => {
    editor?.chain().focus().redo().run()
  }, [editor])

  if (!editor) return null

  return (
    <Paper variant='outlined' sx={{ borderRadius: 1 }}>
      {editable && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            gap: 0.5,
          }}
        >
          <IconButton
            size='small'
            onClick={toggleBold}
            color={editor.isActive('bold') ? 'primary' : 'default'}
            title='Bold'
          >
            <FormatBold />
          </IconButton>
          <IconButton
            size='small'
            onClick={toggleItalic}
            color={editor.isActive('italic') ? 'primary' : 'default'}
            title='Italic'
          >
            <FormatItalic />
          </IconButton>
          <IconButton
            size='small'
            onClick={toggleUnderline}
            color={editor.isActive('underline') ? 'primary' : 'default'}
            title='Underline'
          >
            <FormatUnderlined />
          </IconButton>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          <IconButton
            size='small'
            onClick={toggleBulletList}
            color={editor.isActive('bulletList') ? 'primary' : 'default'}
            title='Bullet List'
          >
            <FormatListBulleted />
          </IconButton>
          <IconButton
            size='small'
            onClick={toggleOrderedList}
            color={editor.isActive('orderedList') ? 'primary' : 'default'}
            title='Numbered List'
          >
            <FormatListNumbered />
          </IconButton>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          <IconButton size='small' onClick={undo} disabled={!editor.can().undo()} title='Undo'>
            <Undo />
          </IconButton>
          <IconButton size='small' onClick={redo} disabled={!editor.can().redo()} title='Redo'>
            <Redo />
          </IconButton>
        </Box>
      )}

      <Box
        sx={{
          minHeight: `${minHeight}px`,
          '& .ProseMirror': {
            outline: 'none !important',
            padding: '16px',
          },
          '& .ProseMirror ul': {
            listStyleType: 'disc',
            listStylePosition: 'outside',
            paddingLeft: '1.5rem',
            margin: '0.5rem 0',
          },
          '& .ProseMirror ol': {
            listStyleType: 'decimal',
            listStylePosition: 'outside',
            paddingLeft: '1.5rem',
            margin: '0.5rem 0',
          },
          '& .ProseMirror li': {
            display: 'list-item',
            marginBottom: '0.25rem',
          },
          '& .ProseMirror li p': {
            margin: '0.25rem 0',
          },
          '& .ProseMirror p': {
            margin: '0.5rem 0',
          },
          '& .ProseMirror strong': {
            fontWeight: 'bold',
          },
          '& .ProseMirror em': {
            fontStyle: 'italic',
          },
          '& .ProseMirror u': {
            textDecoration: 'underline',
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  )
}

export default TiptapEditor
