import dayjs from 'dayjs'
import { Note, User } from '@/models/notes'

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Khoa Tran', color: '#1976d2', isActive: true, lastActivity: new Date().toISOString() },
  { id: 'user-2', name: 'Bob Smith', color: '#388e3c', isActive: true, lastActivity: new Date().toISOString() },
  { id: 'user-3', name: 'Charlie Brown', color: '#f57c00', isActive: false, lastActivity: new Date().toISOString() },
  { id: 'user-4', name: 'Diana Prince', color: '#7b1fa2', isActive: true, lastActivity: new Date().toISOString() },
]

export const createMockNotes = (): Note[] => [
  {
    id: 'note-1',
    title: 'Welcome to Collaborative Notes',
    content: `# Welcome to Collaborative Notes

This is a **real-time collaborative** note-taking application where multiple users can:

- Create and edit notes simultaneously
- See real-time updates from other collaborators
- Handle conflicts when editing the same content
- Format text with *rich text* editor

Try editing this note and see the magic happen!`,
    createdAt: dayjs().subtract(2, 'days').toISOString(),
    updatedAt: dayjs().subtract(1, 'hour').toISOString(),
    lastEditedBy: 'user-1',
    collaborators: ['user-1', 'user-2'],
    isDeleted: false,
    version: 3,
  },
  {
    id: 'note-2',
    title: 'Project Meeting Notes',
    content: `# Project Meeting - ${dayjs().format('MMMM DD, YYYY')}

**Attendees:** Khoa, Bob, Charlie

## Agenda Items:
1. Review Q4 roadmap
2. Discuss new feature requirements
3. Team capacity planning

## Action Items:
- [ ] Khoa: Finalize wireframes by Friday
- [ ] Bob: Setup development environment
- [ ] Charlie: Research competitor analysis

**Next Meeting:** ${dayjs().add(1, 'week').format('MMMM DD, YYYY')}`,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    updatedAt: dayjs().subtract(2, 'hours').toISOString(),
    lastEditedBy: 'user-2',
    collaborators: ['user-1', 'user-2', 'user-3'],
    isDeleted: false,
    version: 5,
  },
  {
    id: 'note-3',
    title: 'Quick Ideas',
    content: `# Random Ideas 💡

- Build a collaborative note app (✅ Done!)
- Try that new restaurant downtown
- Learn TypeScript advanced patterns
- Organize digital photos
- Plan weekend hiking trip

*Last updated: ${dayjs().format('MMM DD, YYYY')}*`,
    createdAt: dayjs().subtract(3, 'hours').toISOString(),
    updatedAt: dayjs().subtract(30, 'minutes').toISOString(),
    lastEditedBy: 'user-4',
    collaborators: ['user-4'],
    isDeleted: false,
    version: 2,
  },
]
