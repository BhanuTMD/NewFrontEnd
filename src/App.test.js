


import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
test('renders Technology Database heading', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Wait for the heading to appear (use findByText for async-safe query)
  const heading = await screen.findByText(/Technology Database/i);
  expect(heading).toBeInTheDocument();
});