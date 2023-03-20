import TextInput from '../textInput/TextInput';
import { View, StyleSheet, Text, Platform, Dimensions } from 'react-native';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldValues } from 'react-hook-form';
import { useState } from 'react';
import Popup from '../popup/Popup';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { register } from '../../services/authServices/jwtAuthServices';
import React from 'react';

export type FormErrors = {
    name?: string;
    surname?: string;
    mobile?: string;
    email?: string,
    password?: string,
    errors?: string
};

export interface ApiResponse {
    status: string | number;
    message?: string;
    data?: any;
    errors?: any;
}


const SignupScreen: React.FC = () => {

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [response, setResponse] = useState<undefined | { status: string }>();
    const methods = useForm<FieldValues>({});

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const response = await register(
                data.name,
                data.surname,
                data.mobile,
                data.email,
                data.password
            );
            const apiResponse: ApiResponse = response.data;
            if (apiResponse.errors) {
                const errorMsg: FormErrors = {
                    errors: apiResponse.errors
                };
                setFormErrors(errorMsg);
            } else {
                setFormErrors({});
                setResponse({ status: 'success' });
                methods.reset();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onError: SubmitErrorHandler<FieldValues> = (errors) => {
        const errorMsg: FormErrors = {
            name: typeof errors.name?.message === 'string' ? errors.name.message : undefined,
            surname: typeof errors.surname?.message === 'string' ? errors.surname.message : undefined,
            mobile: typeof errors.mobile?.message === 'string' ? errors.mobile.message : undefined,
            email: typeof errors.email?.message === 'string' ? errors.email.message : undefined,
            password: typeof errors.password?.message === 'string' ? errors.password.message : undefined
        };
        setFormErrors(errorMsg);
    };

    const nameRegex = /^[A-Za-z]+$/;
    const mobileRegex = /^(\+|\d)[0-9]{7,16}$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    const renderError = (fieldName: keyof FormErrors) => {
        if (formErrors[fieldName]) {
            return <Text style={styles.errorMessage}>{formErrors[fieldName]}</Text>;
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.login}>
                <View>
                    <Text style={styles.title}>Login</Text>
                </View>
            </View>
            <FormProvider {...methods}>
                {formErrors.errors && (
                    <Text style={styles.errorMessage}>
                        <Popup error={formErrors.errors} setFormErrors={setFormErrors} />
                    </Text>
                )}
                <TextInput
                    name="name"
                    label="Name"
                    placeholder="Name"
                    keyboardType="default"
                    rules={{
                        required: 'Name is required!',
                        pattern: {
                            value: nameRegex,
                            message: 'Invalid name format'
                        }
                    }}
                />
                {renderError('name')}
                <TextInput
                    name="surname"
                    label="Surname"
                    placeholder="Surname"
                    keyboardType="default"
                    rules={{
                        required: 'Surname is required!',
                        pattern: {
                            value: nameRegex,
                            message: 'Invalid surname format'
                        }
                    }}
                />
                {renderError('surname')}
                <TextInput
                    name="mobile"
                    label="Mobile"
                    placeholder="Mobile"
                    rules={{
                        required: 'Mobile is required!',
                        pattern: {
                            value: mobileRegex,
                            message: 'Invalid mobile format'
                        }
                    }}
                />
                {renderError('mobile')}
                <TextInput
                    name="email"
                    label="Email"
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    rules={{
                        required: 'Email is required!',
                        pattern: {
                            value: emailRegex,
                            message: 'Invalid email address'
                        }
                    }}
                />
                {renderError('email')}
                <TextInput
                    name="password"
                    label="Password"
                    placeholder="********"
                    secureTextEntry
                    rules={{
                        required: 'Password is required!',
                        pattern: {
                            value: passwordRegex,
                            message: 'Password must have 8 symbol one uppercase and one symbol (e.g. !)'
                        }
                    }}
                />
                {renderError('password')}
                <TextInput
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="********"
                    secureTextEntry
                    rules={{
                        required: 'Confirm Password is required!',
                        validate: (value) =>
                            value === methods.watch('password') || "The passwords don't match"
                    }}
                />
            </FormProvider>
            <View style={styles.button}>
                <TouchableOpacity
                    disabled={response !== undefined}
                    onPress={methods.handleSubmit(onSubmit, onError)}>
                    <Text>Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};



const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    login: {
        alignItems: 'center',
        backgroundColor: '#0e101c'
    },
    title: {
        fontSize: Platform.select({
            ios: 34,
            android: 30
        }),
        color: 'white'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#0e101c',
        width: '100%',
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        marginTop: 8,
    },
    button: {
        backgroundColor: '#f194ff',
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        width: screenWidth >= 768 ? '50%' : '100%',
        alignSelf: screenWidth >= 768 ? 'center' : 'flex-start',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default SignupScreen;