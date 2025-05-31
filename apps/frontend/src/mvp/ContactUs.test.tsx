import React from 'react';
import { render } from '@testing-library/react';
import ContactUs from './ContactUs';

describe('ContactUs Component', () => {
  it('renders without crashing', () => {
    render(<ContactUs />);
  });
});
