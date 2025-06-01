import { Note } from '@/models/notes'

export type Routes = {
  href: string
  id: string
  name: string
  element: React.ReactNode
}

export interface HeaderProps {
  searchQuery: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onNewNoteClick: () => void
}
export interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onShare: (id: string) => void
  users: Array<{ id: string; name: string; color: string }>
}
