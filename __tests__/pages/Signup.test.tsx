import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Signup from '../../src/components/pages/Signup';

jest.mock('react-native-modal', () => 'Modal');

const navigation: any = { navigate: jest.fn() };

describe('Signup component', () => {
  test('displays an error message when the form is submitted with invalid input', async () => {
    const { getByTestId, getByText } = render(<Signup navigation={navigation} />);

    const nameInput = getByTestId('name-input');
    fireEvent.changeText(nameInput, '');
    const surnameInput = getByTestId('surname-input');
    fireEvent.changeText(surnameInput, '');
    const mobileInput = getByTestId('mobile-input');
    fireEvent.changeText(mobileInput, '');
    const emailInput = getByTestId('email-input');
    fireEvent.changeText(emailInput, 'invalid-email');
    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(passwordInput, 'invalid-password');

    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Name is required!')).toBeTruthy();
      expect(getByText('Surname is required!')).toBeTruthy();
      expect(getByText('Mobile is required!')).toBeTruthy();
      expect(getByText('Invalid email address')).toBeTruthy();
      expect(getByText('Password must have 8 symbol one uppercase and one symbol (e.g. !)')).toBeTruthy();
    });
  });
});
