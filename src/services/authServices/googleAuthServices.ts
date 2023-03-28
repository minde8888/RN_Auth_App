import api from '../apiServices/instanceApi';
import AuthError from '../handleServerErrorServices/authError';
import NetworkError from '../handleServerErrorServices/networkError';

const AUTH_URL = 'Auth/';

interface Response {
  errors?: string;
  token: string;
  refreshToken: string;
  susses: boolean;
}

export const googleLogin = async (
  provider: string,
  idToken: string,
): Promise<Response> => {
  try {
    const { data } = await api.post<Response>(AUTH_URL + 'google-login', {
      provider: provider,
      accessToken: idToken,
    });
    console.log(data);    

    if (!(Object.keys(data).length !== 0)) {
      throw new AuthError('no user found');
    }
    return { ...data, errors: data.errors ? data.errors[0] : '' };
  } catch (error: any) {
    if (error instanceof NetworkError) {
      throw new AuthError('invalid token');
    } else if (!error.response?.data) { 
      throw new AuthError('server error');
    } else {
      throw new AuthError(error.response.data.errors.$values.join(', '));
    }
  }
};

