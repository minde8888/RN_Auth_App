import axios, {AxiosError} from 'axios';
import api from '../apiServices/instanceApi';
import AuthError from '../handleServerErrorServices/authError';
import {ServerError} from '../typings';

const AUTH_URL = 'Auth/';

interface Response {
  errors: string;
  token: string;
  refreshToken: string;
  susses: boolean;
  user: User;
}

interface User {
  $id: string;
  name: string;
  surname: string;
  email: string;
  roles?: string;
  phoneNumber: string;
  imageName?: string;
}

export const googleLogin = async (
  provider: string,
  idToken: string,
): Promise<Response> => {
  try {
    const {data} = await api.post<Response>(AUTH_URL + 'google-login', {
      provider: provider,
      accessToken: idToken,
    });
    console.log(data);    

    if (!(Object.keys(data).length !== 0)) {
      throw new AuthError('no user found');
    }
    return {...data, errors: data.errors ? data.errors[0] : ''};
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<ServerError>;
      if (serverError && serverError.response?.data) {
        throw new AuthError(serverError.response.data.errors.$values[0]);
      }
      throw new AuthError(error.message);
    }
    throw error;
  }
};
