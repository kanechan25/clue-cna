import React from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button className='bg-blue-300 mt-4 text-white p-2 rounded hover:bg-blue-600 cursor-pointer' onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
