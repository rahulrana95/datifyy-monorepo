import React from 'react';
import { render } from '@testing-library/react';
import PrivacyPolicy from './PrivacyPolicy';

describe('PrivacyPolicy Component', () => {
  it('renders without crashing', () => {
    render(<PrivacyPolicy />);
  });
});
