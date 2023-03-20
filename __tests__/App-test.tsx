/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import { render } from '@testing-library/react-native';
import { store } from '../src/redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from '../src/routes/context/AuthContext';

describe('<App />', () => {
  test('renders without error', () => {
    const { getByTestId } = render(<App />);
    const appContainer = getByTestId('app-container');
    expect(appContainer).toBeDefined();
  });
});