import React, { useCallback, useEffect, useMemo } from 'react'
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
import { TiptapEditorProps } from '@/models/types'

const TiptapEditor: React.FC<TiptapEditorProps> = React.memo(
  ({ content = '', onUpdate, placeholder = 'Start typing...', editable = true, minHeight = 200 }) => {
    const extensions = useMemo(
      () => [
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
      [],
    )

    const editorProps = useMemo(
      () => ({
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
          style: `min-height: ${minHeight}px; padding: 16px;`,
          'data-placeholder': placeholder,
        },
      }),
      [minHeight, placeholder],
    )

    const handleUpdate = useCallback(
      ({ editor }: { editor: any }) => {
        const html = editor.getHTML()
        onUpdate?.(html)
      },
      [onUpdate],
    )

    const editor = useEditor({
      extensions,
      content: '', // Initialize with empty content to prevent loops
      editable,
      onUpdate: handleUpdate,
      editorProps,
      // Add immediate render to improve performance
      immediatelyRender: false,
    })

    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
          editor.commands.setContent(content, false) // false = don't trigger onUpdate
        })
      }
    }, [editor, content])

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

    const toolbarStyles = useMemo(
      () => ({
        display: 'flex',
        alignItems: 'center',
        p: 1,
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        gap: 0.5,
      }),
      [],
    )

    const editorContainerStyles = useMemo(
      () => ({
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
      }),
      [minHeight],
    )

    const buttonStates = useMemo(
      () => ({
        bold: editor?.isActive('bold') ?? false,
        italic: editor?.isActive('italic') ?? false,
        underline: editor?.isActive('underline') ?? false,
        bulletList: editor?.isActive('bulletList') ?? false,
        orderedList: editor?.isActive('orderedList') ?? false,
        canUndo: editor?.can().undo() ?? false,
        canRedo: editor?.can().redo() ?? false,
      }),
      [editor],
    )

    if (!editor) return null

    return (
      <Paper variant='outlined' sx={{ borderRadius: 1 }}>
        {editable && (
          <Box sx={toolbarStyles}>
            <IconButton
              size='small'
              onClick={toggleBold}
              color={buttonStates.bold ? 'primary' : 'default'}
              title='Bold'
            >
              <FormatBold />
            </IconButton>
            <IconButton
              size='small'
              onClick={toggleItalic}
              color={buttonStates.italic ? 'primary' : 'default'}
              title='Italic'
            >
              <FormatItalic />
            </IconButton>
            <IconButton
              size='small'
              onClick={toggleUnderline}
              color={buttonStates.underline ? 'primary' : 'default'}
              title='Underline'
            >
              <FormatUnderlined />
            </IconButton>

            <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

            <IconButton
              size='small'
              onClick={toggleBulletList}
              color={buttonStates.bulletList ? 'primary' : 'default'}
              title='Bullet List'
            >
              <FormatListBulleted />
            </IconButton>
            <IconButton
              size='small'
              onClick={toggleOrderedList}
              color={buttonStates.orderedList ? 'primary' : 'default'}
              title='Numbered List'
            >
              <FormatListNumbered />
            </IconButton>

            <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

            <IconButton size='small' onClick={undo} disabled={!buttonStates.canUndo} title='Undo'>
              <Undo />
            </IconButton>
            <IconButton size='small' onClick={redo} disabled={!buttonStates.canRedo} title='Redo'>
              <Redo />
            </IconButton>
          </Box>
        )}

        <Box sx={editorContainerStyles}>
          <EditorContent editor={editor} />
        </Box>
      </Paper>
    )
  },
)

TiptapEditor.displayName = 'TiptapEditor'

export default TiptapEditor
