import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { AuthProvider } from '../src/routes/context/AuthContext';
import Routes from '../src/routes/Routes';
import { store } from '../src/redux/store';
import App from '../App';

jest.mock('@react-native-firebase/auth', () => ({
    credential: jest.fn().mockReturnValue('123'),
}));

jest.mock('../src/components/auth/google/GoogleSignIn', () => ({
    __esModule: true,
    default: () => <></>
}))

describe('App', () => {
    test('renders correctly', () => {
        const { toJSON } = render(<App />);
        expect(toJSON()).toMatchSnapshot();
      });
});
