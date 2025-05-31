import React from 'react';
import { render } from '@testing-library/react';
import AboutUs from './AboutUs';

describe('AboutUs Component', () => {
  it('renders without crashing', () => {
    render(<AboutUs />);
  });
});
