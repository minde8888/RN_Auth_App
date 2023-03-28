import  { AxiosResponse} from 'axios';
import {store} from '../../redux/store';
import {userLogout} from '../../redux/slice/authSlice';
import api from '../apiServices/instanceApi';
import AuthError from '../handleServerErrorServices/authError';
import NetworkError from '../handleServerErrorServices/networkError';

const AUTH_URL = 'Auth/';

interface Response {
  errors: string;
  token: string;
  refreshToken: string;
  susses: boolean;
}

export const login = async (
  email: string,
  password: string,
): Promise<Response> => {
  try {
    const {data} = await api.post<Response>(AUTH_URL + 'login', {
      email: email,
      password: password,
    });

    if (!(Object.keys(data).length !== 0)) {
      throw new AuthError('no user found');
    }
    return {...data, errors: data.errors ? data.errors[0] : ''};
  } catch (error: any) {
    if (error instanceof NetworkError) {
      throw new AuthError(
        'Unable to reach server. Please check your internet connection and try again.',
      );
    } else if (error.response?.data?.errors?.$values) {
      const errorMessage = error.response.data.errors.$values[0];
      throw new AuthError(errorMessage);
    } else {
      throw new AuthError('An unknown error has occurred.');
    }
  }
};

export const logout = (): void => {
  store.dispatch(userLogout());
};

export const register = async (
  name: string,
  surname: string,
  mobile: string,
  email: string,
  password: string,
) => {
  try {
    return await api.post<AxiosResponse>(AUTH_URL + 'signup', {
      name: name,
      surname: surname,
      phoneNumber: mobile,
      email: email,
      password: password,
    });
  } catch (error: any) {
    if (error instanceof NetworkError) {
      throw new AuthError(
        'Unable to reach server. Please check your internet connection and try again.',
      );
    } else {
      throw new AuthError(error.response.data.errors.$values.join(', '));
    }
  }
};
