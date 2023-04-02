import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-firebase/auth', () => ({
    credential: jest.fn().mockReturnValue('123'),
}));

jest.mock('../src/components/auth/google/GoogleSignIn', () => ({
    __esModule: true,
    default: () => <></>
}))

jest.mock('../src/components/popup/Popup', () => ({
    __esModule: true,
    default: () => <></>
  }))

describe('App', () => {
    test('renders correctly', () => {
        const { toJSON } = render(<App />);
        expect(toJSON()).toMatchSnapshot();
      });
});
