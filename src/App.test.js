import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Technology Database heading', () => {
  render(<App />);
  const heading = screen.getByText(/Technology Database/i);
  expect(heading).toBeInTheDocument();
});
