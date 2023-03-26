import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Popup from '../../src/components/popup/Popup';
import { ReactTestInstance } from 'react-test-renderer';

describe('Popup component', () => {
    test('should hide the popup when closed', () => {
        const setFormErrors = jest.fn();
        const { queryByTestId } = render(<Popup error="Error message" setFormErrors={setFormErrors} />);

        const closeButton = queryByTestId('close-button') as ReactTestInstance;
        fireEvent.press(closeButton);

        const overlay = queryByTestId('overlay');
        expect(overlay).toBeNull();
        expect(setFormErrors).toHaveBeenCalledWith({ errors: '' });
    });
});
