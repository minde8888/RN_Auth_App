import authReducer, {
  loginSuccess,
  loginFail,
  userLogout,
  changeRefreshToken,
  registerFail,
} from '../../../src/redux/slice/authSlice';

describe('authSlice', () => {
  test('should handle loginSuccess', () => {
    const previousState = {
      isLoggedIn: false,
      token: '',
      refreshToken: '',
    };

    const payload = {
      isLoggedIn: true,
      token: 'token-123',
      refreshToken: 'refresh-token-123',
    };

    const action = loginSuccess(payload);
    const newState = authReducer(previousState, action);

    expect(newState).toEqual({
      isLoggedIn: true,
      token: 'token-123',
      refreshToken: 'refresh-token-123',
    });
  });

  test('should handle loginFail', () => {
    const previousState = {
      isLoggedIn: false,
      token: '',
      refreshToken: '',
    };

    const error = 'login failed';
    const action = loginFail(error);
    const newState = authReducer(previousState, action);

    expect(newState).toEqual({
      isLoggedIn: false,
      error: 'login failed',
      token: '',
      refreshToken: '',
    });
  });

  test('should handle userLogout', () => {
    const previousState = {
      isLoggedIn: true,
      token: 'token-123',
      refreshToken: 'refresh-token-123',
    };

    const action = userLogout();
    const newState = authReducer(previousState, action);

    expect(newState).toEqual({
      isLoggedIn: false,
      token: '',
      refreshToken: '',
    });
  });

  test('should handle changeRefreshToken', () => {
    const previousState = {
      isLoggedIn: true,
      token: 'token-123',
      refreshToken: 'refresh-token-123',
    };

    const payload = {
      token: 'new-token-456',
      refreshToken: 'new-refresh-token-456',
    };

    const action = changeRefreshToken(payload);
    const newState = authReducer(previousState, action);

    expect(newState).toEqual({
      isLoggedIn: true,
      token: 'new-token-456',
      refreshToken: 'new-refresh-token-456',
    });
  });

  test('should handle registerFail', () => {
    const previousState = {
      isLoggedIn: false,
      token: '',
      refreshToken: '',
    };

    const error = 'register failed';
    const action = registerFail(error);
    const newState = authReducer(previousState, action);

    expect(newState).toEqual({
      isLoggedIn: false,
      error: 'register failed',
      token: '',
      refreshToken: '',
    });
  });
});
