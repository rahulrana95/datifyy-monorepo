import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
  // Basic smoke test - just check if app renders
  expect(document.body).toBeInTheDocument();
});
