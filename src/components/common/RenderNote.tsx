import { Box } from '@mui/material'

const RenderNote = ({ previewContent }: { previewContent: string }) => {
  return (
    <Box
      sx={{
        mb: 2,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        lineHeight: 1.5,
        color: 'text.secondary',
        fontSize: '0.875rem',
        '& p': {
          margin: '0.25rem 0',
          fontSize: 'inherit',
        },
        '& strong': {
          fontWeight: 'bold',
        },
        '& em': {
          fontStyle: 'italic',
        },
        '& u': {
          textDecoration: 'underline',
        },
        '& ul': {
          paddingLeft: '1.5rem',
          margin: '0.25rem 0',
          listStyleType: 'disc',
          listStylePosition: 'outside',
        },
        '& ol': {
          paddingLeft: '1.5rem',
          margin: '0.25rem 0',
          listStyleType: 'decimal',
          listStylePosition: 'outside',
        },
        '& ul.tiptap-bullet-list': {
          listStyleType: 'disc',
        },
        '& ol.tiptap-ordered-list': {
          listStyleType: 'decimal',
        },
        '& li': {
          fontSize: 'inherit',
          display: 'list-item',
          marginBottom: '0.125rem',
        },
        '& li p': {
          margin: '0',
          display: 'inline',
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          fontWeight: 'bold',
          margin: '0.25rem 0',
          fontSize: 'inherit',
        },
      }}
      dangerouslySetInnerHTML={{ __html: previewContent }}
    />
  )
}

export default RenderNote
