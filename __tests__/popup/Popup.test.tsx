import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Popup, { Props } from '../../src/components/popup/Popup';

jest.mock('react-native-modal', () => 'Modal');

describe('Popup', () => {
  const defaultProps: Props = {
    error: 'Test error',
    togglePopup: jest.fn(),
    popupVisible: true,
  };

  test('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <Popup {...defaultProps} />
    );
    expect(getByTestId('overlay')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
    expect(getByText('Close')).toBeTruthy();
  });

  test('calls togglePopup function when close button is pressed', () => {
    const togglePopup = jest.fn();
    const { getByTestId } = render(
      <Popup {...defaultProps} togglePopup={togglePopup} />
    );
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);
    expect(togglePopup).toHaveBeenCalled();
  });
});




