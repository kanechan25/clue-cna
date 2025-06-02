import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Home } from '@/pages/Home'
import { render } from '../utils'

describe('Home Page', () => {
  describe('Basic Text Rendering', () => {
    it('should render "My Notes" header', () => {
      render(<Home />)
      expect(screen.getByText('My Notes')).toBeInTheDocument()
    })

    it('should render welcome message with user name and stats', () => {
      render(<Home />)

      expect(screen.getByText(/Welcome back, Khoa Tran!/)).toBeInTheDocument()
      expect(screen.getByText(/2 notes/)).toBeInTheDocument()
      expect(screen.getByText(/2 collaborative/)).toBeInTheDocument()
    })

    it('should render note titles from mock data', () => {
      render(<Home />)

      expect(screen.getByText('About me')).toBeInTheDocument()
      expect(screen.getByText('Technical skills')).toBeInTheDocument()
    })

    it('should render search placeholder', () => {
      render(<Home />)
      expect(screen.getByPlaceholderText('Search notes...')).toBeInTheDocument()
    })

    it('should render New Note button', () => {
      render(<Home />)
      expect(screen.getByText('New Note')).toBeInTheDocument()
    })
  })
})
