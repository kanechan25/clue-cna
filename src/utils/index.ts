import { Conflict } from '@/models/notes'

export function getLatestOperationId(conflicts: Conflict[], conflictId: string) {
  const conflict = conflicts.find((c) => c.id === conflictId)
  if (!conflict) {
    throw new Error(`Conflict with ID "${conflictId}" not found.`)
  }

  const latestOp = conflict.operations.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
  })

  return latestOp.id
}
export function cleanEditorContent(input: string): string {
  const textContent = input.replace(/<\/?[^>]+(>|$)/g, '')

  const lastColonIndex = textContent.lastIndexOf(':')
  if (lastColonIndex !== -1) {
    const message = textContent.slice(lastColonIndex + 1).trim()
    return `<p>${message}</p>`
  }
  return input
}
