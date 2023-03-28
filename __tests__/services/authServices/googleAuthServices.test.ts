import AuthError from '../../../src/services/handleServerErrorServices/authError';
import api from '../../../src/services/apiServices/instanceApi';
import {googleLogin} from '../../../src/services/authServices/googleAuthServices';

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
    };
    mockedApi.post.mockRejectedValueOnce(mockError);
  
    try {
      await googleLogin('google', 'invalidToken');
    } catch (error: any) {
      expect(error.message).toBe('invalid token');
    }
  });  

  test('throws AuthError with error message when API call returns error without response data', async () => {
    const mockError = new Error('server error');
    mockedApi.post.mockRejectedValueOnce(mockError);

    try {
      await googleLogin('google', 'mockToken');
      fail('Expected googleLogin to throw an AuthError.');
    } catch (error: any) {
      expect(error).toBeInstanceOf(AuthError);
      expect(error.message).toBe('server error');
    }
  });
});
