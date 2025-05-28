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
    content: `<h1>Welcome to Collaborative Notes</h1><p>This is a <strong>real-time collaborative</strong> note-taking application where multiple users can:</p><ul><li>Create and edit notes simultaneously</li><li>See real-time updates from other collaborators</li><li>Handle conflicts when editing the same content</li><li>Format text with <em>rich text</em> editor</li></ul><p>Try editing this note and see the magic happen!</p>`,
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
    content: `<h1>Project Meeting - ${dayjs().format('MMMM DD, YYYY')}</h1><p><strong>Attendees:</strong> Khoa, Bob, Charlie</p><h2>Agenda Items:</h2><ol><li>Review Q4 roadmap</li><li>Discuss new feature requirements</li><li>Team capacity planning</li></ol><h2>Action Items:</h2><ul><li>Khoa: Finalize wireframes by Friday</li><li>Bob: Setup development environment</li><li>Charlie: Research competitor analysis</li></ul><p><strong>Next Meeting:</strong> ${dayjs().add(1, 'week').format('MMMM DD, YYYY')}</p>`,
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
    content: `<h1>Random Ideas 💡</h1><ul><li>Build a collaborative note app (✅ <strong>Done!</strong>)</li><li>Try that new restaurant downtown</li><li>Learn <em>TypeScript</em> advanced patterns</li><li>Organize digital photos</li><li>Plan weekend hiking trip</li></ul><p><em>Last updated: ${dayjs().format('MMM DD, YYYY')}</em></p>`,
    createdAt: dayjs().subtract(3, 'hours').toISOString(),
    updatedAt: dayjs().subtract(30, 'minutes').toISOString(),
    lastEditedBy: 'user-4',
    collaborators: ['user-4'],
    isDeleted: false,
    version: 2,
  },
]
