import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthContext, AuthProvider } from '../../src/routes/context/AuthContext';

describe('AuthProvider', () => {
  test('renders children with AuthContext value', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ isAuth }) => <Text testID="is-auth">{isAuth.toString()}</Text>}
        </AuthContext.Consumer>
      </AuthProvider>,
    );
    const isAuthElement = getByTestId('is-auth');
    expect(isAuthElement.props.children).toBe('false');
  });
});
