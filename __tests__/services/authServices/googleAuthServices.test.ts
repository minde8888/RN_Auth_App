import {AxiosError} from 'axios';
import AuthError from '../../../src/services/handleServerErrorServices/authError';
import api from '../../../src/services/apiServices/instanceApi';
import {googleLogin} from '../../../src/services/authServices/googleAuthServices';
import {ServerError} from '../../../src/services/typings';

jest.mock('../apiServices/authHeader.test');

describe('googleLogin', () => {
  const mockedApi = api as jest.Mocked<typeof api>;

  test('returns response data when API call succeeds', async () => {
    const mockResponse = {
      errors: '',
      token: 'mockToken',
      refreshToken: 'mockRefreshToken',
      success: true,
    };
    const mockApiPost = jest.fn().mockResolvedValue({data: mockResponse});
    api.post = mockApiPost;
    await expect(googleLogin('google', 'validToken')).resolves.toEqual(
      mockResponse,
    );
  });

  test('throws AuthError with error message when API call returns error with response data', async () => {
    const mockError = {
      response: {
        data: {
          errors: {
            $values: ['invalid token'],
          },
        },
      },
    } as AxiosError<ServerError>;
    mockedApi.post.mockRejectedValueOnce(mockError);

    try {
      await googleLogin('google', 'invalidToken');
    } catch (error: any) {
      expect(error.response.data.errors.$values[0]).toBe('invalid token');
    }
  });

  test('throws AuthError with error message when API call returns error without response data', async () => {
    const mockError = new Error('server error');
    mockedApi.post.mockRejectedValueOnce(mockError);

    await expect(googleLogin('google', 'mockToken')).rejects.toThrow(
      new AuthError('server error'),
    );
  });
});
