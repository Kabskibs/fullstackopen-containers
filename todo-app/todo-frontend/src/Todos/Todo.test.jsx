import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders todo', () => {
  const todo = {
    text: 'This is a test',
    done: true
  }

  render(<Todo todo={todo} />)

  const element = screen.getByText('This is a test')
  expect(element).toBeDefined()
})