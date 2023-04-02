import TextInput from '../textInput/TextInput';
import { View, StyleSheet, Text, Platform, Dimensions, Button, ScrollView } from 'react-native';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldValues } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import Popup from '../popup/Popup';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { register } from '../../services/authServices/jwtAuthServices';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { ApiResponse } from '../../services/typings';

export type FormErrors = {
    name?: string;
    surname?: string;
    mobile?: string;
    email?: string,
    password?: string,
    errors?: string
};

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
}

const Signup = ({ navigation }: Props) => {

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [response, setResponse] = useState<undefined | { status: string }>();
    const methods = useForm<FieldValues>({});
    const [popupVisible, setPopupVisible] = useState(true);

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
                setPopupVisible(true)
                const errorMsg: FormErrors = {
                    errors: apiResponse.errors
                };
                setFormErrors(errorMsg);
            } else {
                setFormErrors({});
                setResponse({ status: 'success' });
                methods.reset();
            }
        } catch (error: any) {
            const errorMsg: FormErrors = {
                errors: error.toString().split("Error: ")[1]
            };
            setPopupVisible(true)
            setFormErrors(errorMsg);
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
    const mobileRegex = /^(\+?\d{1,3}|\d{8,16})$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    const renderError = (fieldName: keyof FormErrors) => {
        if (formErrors[fieldName]) {
            return <Text style={styles.errorMessage}>{formErrors[fieldName]}</Text>;
        }
        return null;
    };

    useEffect(() => {
        if (response?.status === "success") {
            navigation.navigate('Login')
        }
    }, [response?.status]);

    const togglePopup = useCallback(() => {
        setPopupVisible(!popupVisible);
        setFormErrors({});
    }, []);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <FormProvider {...methods}>
                    {formErrors.errors && (
                        <Text style={styles.errorMessage}>
                            <Popup
                                error={formErrors.errors}
                                togglePopup={togglePopup}
                                popupVisible={popupVisible} />
                        </Text>
                    )}
                    <TextInput
                        testID="name-input"
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
                        testID='surname-input'
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
                        testID='mobile-input'
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
                        testID='email-input'
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
                        testID='password-input'
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
                        testID='invalid-password'
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
                        <Text testID='submit-button' style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        fontSize: 14,
        marginTop: 8,
    },
    container: {
        backgroundColor: '#0e101c',
        paddingHorizontal: 32,
        paddingVertical: 24,
        minHeight: screenHeight,
    },
    title: {
        fontSize: Platform.select({
            ios: 34,
            android: 30
        }),
        color: 'white',
        marginBottom: 24,
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
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Signup;