import {AxiosError} from 'axios';
import {userLogout} from '../../../src/redux/slice/authSlice';
import {store} from '../../../src/redux/store';
import api from '../../../src/services/apiServices/instanceApi';
import AuthError from '../../../src/services/handleServerErrorServices/authError';
import NetworkError from '../../../src/services/handleServerErrorServices/networkError';
import {
  login,
  logout,
  register,
} from '../../../src/services/authServices/jwtAuthServices';

jest.mock('../../../src/services/apiServices/instanceApi');

describe('Auth Services', () => {
  describe('login', () => {
    test('returns data when API call succeeds', async () => {
      const mockData = {
        token: 'token',
        refreshToken: 'refreshToken',
        success: true,
      };
      (api.post as jest.Mock).mockResolvedValueOnce({data: mockData});

      const response = await login('email', 'password');

      expect(response).toEqual({
        ...mockData,
        errors: '',
      });
    });

    test('throws AuthError with error message when API call returns error with response data', async () => {
      const mockError = {
        response: {
          data: {
            errors: {
              $values: ['invalid credentials'],
            },
          },
        },
      } as AxiosError;
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      try {
        await login('email', 'password');
      } catch (error: any) {
        expect(error.message).toBe(
          'invalid credentials',
        );
      }
    });

    test('throws AuthError with default message when API call fails with network error', async () => {
      const mockError = new NetworkError(
        'Unable to reach server. Please check your internet connection and try again.',
        404,
      );
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(login('email', 'password')).rejects.toThrow(
        new AuthError(
          'Unable to reach server. Please check your internet connection and try again.',
        ),
      );
    });
  });

  describe('logout', () => {
    test('dispatches userLogout action', () => {
      store.dispatch = jest.fn();

      logout();

      expect(store.dispatch).toHaveBeenCalledWith(userLogout());
    });
  });

  describe('register', () => {
    test('returns response data when API call succeeds', async () => {
      const mockData = {
        data: {},
      };
      (api.post as jest.Mock).mockResolvedValueOnce(mockData);

      const response = await register(
        'name',
        'surname',
        'mobile',
        'email',
        'password',
      );

      expect(response).toEqual(mockData);
    });

    test('throws AuthError with error message when API call returns error with response data', async () => {
      const mockError = {
        response: {
          data: {
            errors: {
              $values: ['email already exists'],
            },
          },
        },
      } as AxiosError;
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      try {
        await register('name', 'surname', 'mobile', 'email', 'password');
      } catch (error: any) {
        expect(error.message).toBe(
          'email already exists',
        );
      }
    });

    test('throws AuthError with default message when API call fails with network error', async () => {

      const mockError = new NetworkError(
        'Unable to reach server. Please check your internet connection and try again.',
        404,
      );
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        register('name', 'surname', 'mobile', 'email', 'password'),
      ).rejects.toThrow(
        new AuthError(
          'Unable to reach server. Please check your internet connection and try again.',
        ),
      );
    });
  });
});
