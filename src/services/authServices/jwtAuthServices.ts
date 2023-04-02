import {AxiosResponse} from 'axios';
import {store} from '../../redux/store';
import {userLogout} from '../../redux/slice/authSlice';
import api from '../apiServices/instanceApi';
import AuthError from '../handleServerErrorServices/authError';
import NetworkError from '../handleServerErrorServices/networkError';
import {ApiResponse} from '../typings';

const AUTH_URL = 'Auth/';

interface Response {
  data: ApiResponse;
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
    return {...data};
  } catch (error: any) {
    if (error instanceof NetworkError) {
      throw new AuthError(
        'Unable to reach server. Please check your internet connection and try again.',
      );
    }

    const {data} = error.response;

    if (data.errors) {
      const errorMessages = Object.entries(data.errors).flatMap(
        ([fieldName, errors]: [string, unknown]) =>
          (errors as string[]).map(
            (errorMessage: string) => `${fieldName}: ${errorMessage}`,
          ),
      );
      throw new AuthError(errorMessages.join('; '));
    }

    if (data.Message) {
      const errorMessages = `${data.Message} Code:  ${data.Reason}`;
      throw new AuthError(errorMessages);
    }

    throw new AuthError(`An unknown error occurred. ${error.message}`);
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
      roles: 'Basic',
    });
  } catch (error: any) {
    if (error instanceof NetworkError) {
      throw new AuthError(
        'Unable to reach server. Please check your internet connection and try again.',
      );
    }

    const {data} = error.response;

    if (data.errors) {
      const errorMessages = Object.entries(data.errors).flatMap(
        ([fieldName, errors]: [string, unknown]) =>
          (errors as string[]).map(
            (errorMessage: string) => `${fieldName}: ${errorMessage}`,
          ),
      );
      throw new AuthError(errorMessages.join('; '));
    }

    if (data.Message) {
      const errorMessages = `${data.Message} Code:  ${data.Reason}`;
      throw new AuthError(errorMessages);
    }

    throw new AuthError(`An unknown error occurred. ${error.message}`);
  }
};
