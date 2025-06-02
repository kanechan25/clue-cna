import dayjs from 'dayjs'
import { Note, User } from '@/models/notes'

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Khoa Tran', color: '#1976d2', isActive: true, lastActivity: new Date().toISOString() },
  { id: 'user-2', name: 'A Person', color: '#388e3c', isActive: true, lastActivity: new Date().toISOString() },
  { id: 'user-3', name: 'B Person', color: '#f57c00', isActive: false, lastActivity: new Date().toISOString() },
  { id: 'user-4', name: 'C Person', color: '#7b1fa2', isActive: true, lastActivity: new Date().toISOString() },
  { id: 'user-5', name: 'D Person', color: '#7b1fa2', isActive: true, lastActivity: new Date().toISOString() },
]

export const createMockNotes = (): Note[] => [
  {
    id: 'note-1',
    title: 'About me',
    content: `<ul class="tiptap-bullet-list"><li><p>A <strong>senior frontend-focused fullstack</strong> engineer.</p></li><li><p>Delivering <u>scalable, high-performance</u> products.</p></li><li><p>+6 years of <em>hands-on experience</em>.</p></li><li><p>Worked cross-functionally with products and backend engineers.</p></li></ul>`,
    createdAt: dayjs().subtract(2, 'days').toISOString(),
    updatedAt: dayjs().subtract(1, 'hour').toISOString(),
    lastEditedBy: 'user-1',
    collaborators: ['user-1', 'user-5'],
    isDeleted: false,
    version: 3,
  },
  {
    id: 'note-2',
    title: 'Technical skills',
    content: `<ol class="tiptap-ordered-list"><li><p><strong>TypeScript</strong>, JavaScript,<u> SQL</u>, GraphQL, C#</p></li><li><p><u>React.js</u>, Next.js, NestJS, Node.js</p></li><li><p>&nbsp;Jest, Cypress, websocket, Docker</p></li></ol>`,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    updatedAt: dayjs().subtract(2, 'hours').toISOString(),
    lastEditedBy: 'user-2',
    collaborators: ['user-1', 'user-2', 'user-3'],
    isDeleted: false,
    version: 5,
  },
]

export const randomCommentText = [
  'Great point!',
  'I agree with this approach.',
  'Maybe we should consider...',
  'Added some thoughts here.',
  'This looks good to me.',
  'Let me add my perspective on this.',
  'Interesting idea! 💡',
  'I have some concerns about this.',
  'Perfect! This is exactly what we need.',
  'Can we expand on this section?',
  'Updated based on our discussion.',
  'This needs more detail.',
  'Excellent work! 👏',
  'I disagree with this point.',
  "Let's discuss this in our next meeting.",
]
