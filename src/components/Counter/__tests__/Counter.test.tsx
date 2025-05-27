import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Counter } from '../Counter'

describe('Counter', () => {
  it('renders with default props', () => {
    render(<Counter />)

    // Check if default label is rendered
    expect(screen.getByText('Count')).toBeInTheDocument()

    // Check if initial count value is 0
    expect(screen.getByTestId('count-value')).toHaveTextContent('0')

    // Check if all buttons are present
    expect(screen.getByLabelText('Decrease count')).toBeInTheDocument()
    expect(screen.getByLabelText('Reset count')).toBeInTheDocument()
    expect(screen.getByLabelText('Increase count')).toBeInTheDocument()
  })

  it('renders with custom props', () => {
    render(<Counter initialValue={10} label='Custom Counter' />)

    expect(screen.getByText('Custom Counter')).toBeInTheDocument()
    expect(screen.getByTestId('count-value')).toHaveTextContent('10')
  })

  it('increments count when + button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    const incrementButton = screen.getByLabelText('Increase count')
    await user.click(incrementButton)

    expect(screen.getByTestId('count-value')).toHaveTextContent('1')
  })

  it('decrements count when - button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter initialValue={5} />)

    const decrementButton = screen.getByLabelText('Decrease count')
    await user.click(decrementButton)

    expect(screen.getByTestId('count-value')).toHaveTextContent('4')
  })

  it('resets count when Reset button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter initialValue={5} />)

    // First increment the value
    const incrementButton = screen.getByLabelText('Increase count')
    await user.click(incrementButton)
    expect(screen.getByTestId('count-value')).toHaveTextContent('6')

    // Then reset
    const resetButton = screen.getByLabelText('Reset count')
    await user.click(resetButton)
    expect(screen.getByTestId('count-value')).toHaveTextContent('5')
  })

  it('handles multiple interactions correctly', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    const incrementButton = screen.getByLabelText('Increase count')
    const decrementButton = screen.getByLabelText('Decrease count')

    // Increment twice
    await user.click(incrementButton)
    await user.click(incrementButton)
    expect(screen.getByTestId('count-value')).toHaveTextContent('2')

    // Decrement once
    await user.click(decrementButton)
    expect(screen.getByTestId('count-value')).toHaveTextContent('1')
  })
})
