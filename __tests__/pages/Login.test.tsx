import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithContext } from '../../context/renderWithContext';
import Login from '../../src/components/pages/Login';

jest.mock('@react-native-firebase/auth', () => ({
  credential: jest.fn().mockReturnValue('123'),
}));

jest.mock('../../src/components/auth/google/GoogleSignIn', () => ({
  __esModule: true,
  default: () => <></>
}))

jest.mock('../../src/components/popup/Popup', () => ({
  __esModule: true,
  default: () => <></>
}))

const navigation: any = { navigate: jest.fn() };

describe('Login', () => {

  test('renderWithContexts correctly', () => {
    const { getByLabelText, getByTestId } = renderWithContext(<Login navigation={navigation} />);

    const emailInput = getByLabelText('Email');
    expect(emailInput).toBeTruthy();

    const passwordInput = getByLabelText('Password');
    expect(passwordInput).toBeTruthy();

    const loginButton = getByTestId('login-button');
    expect(loginButton).toBeTruthy();
  });

  test('displays error message for invalid email input', async () => {
    const { getByLabelText, getByTestId, getByText } = renderWithContext(<Login navigation={navigation} />);
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'valid-password');
    fireEvent.press(loginButton);

    const errorMessage = await waitFor(() => getByText('Invalid email address'));
    expect(errorMessage).toBeTruthy();
  });

  test('displays error message for invalid password input', async () => {
    const { getByLabelText, getByText, getByTestId } = renderWithContext(<Login navigation={navigation} />);
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'valid-email@example.com');
    fireEvent.changeText(passwordInput, 'invalid-password');
    fireEvent.press(loginButton);

    const errorMessage = await waitFor(() => getByText(/Password must have 8 symbol one uppercase and one symbol \(e\.g\. !\)/i));
    expect(errorMessage).toBeTruthy();
  });
});
