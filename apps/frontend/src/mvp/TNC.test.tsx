import React from 'react';
import { render } from '@testing-library/react';
import TNC from './TNC';

describe('TNC Component', () => {
  it('renders without crashing', () => {
    render(<TNC />);
  });
});
