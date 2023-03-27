import { store } from "../../../src/redux/store";
import { authHeader } from "../../../src/services/apiServices/authHeader";


describe('authHeader', () => {
  test('returns an empty object if the token is not available', () => {
    // Mock the state to return an empty token
    const getState = jest.spyOn(store, 'getState');
    getState.mockReturnValue({
      data: {
        auth: {
          token: '',
          refreshToken: '',
        },
      },
    });

    expect(authHeader()).toEqual({});
  });

  test('returns an object with Authorization header if token is available', () => {
    // Mock the state to return a non-empty token
    const getState = jest.spyOn(store, 'getState');
    getState.mockReturnValue({
      data: {
        auth: {
          token: 'some_token',
          refreshToken: '',
        },
      },
    });

    expect(authHeader()).toEqual({ Authorization: 'Bearer some_token' });
  });
});
