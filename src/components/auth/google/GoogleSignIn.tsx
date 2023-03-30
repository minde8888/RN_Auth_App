import React from 'react';
import { useContext, useState } from 'react';
import type { ReactElement } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { googleLogin } from '../../../services/authServices/googleAuthServices';
import { CLIENT_ID } from "@env"
import { loginSuccess } from '../../../redux/slice/authSlice';
import { useAppDispatch } from '../../../redux/store';
import { AuthContext } from '../../../routes/context/AuthContext';

const GoogleSignIn = (): ReactElement => {

    const [isSigninInProgress, setIsSigninInProgress] = useState(false);
    const dispatch = useAppDispatch();
    const { setIsAuth } = useContext(AuthContext);

    GoogleSignin.configure({
        webClientId: CLIENT_ID,
    });

    const onGoogleButtonPress = async () => {
        setIsSigninInProgress(true);

        try {
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const data = await googleLogin(googleCredential.providerId, googleCredential.token)
            dispatch(loginSuccess(data))
            setIsAuth(true);
        } catch (error: any) {
            console.error('Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.error('User cancelled the login flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.error('Operation (e.g. sign in) is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.error('Play services not available or outdated');
            } else {
                console.error('Some other error happened');
            }
        } finally {
            setIsSigninInProgress(false);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            <GoogleSigninButton
                testID='google-signin-button'
                style={styles.googleButton}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={onGoogleButtonPress}
                disabled={isSigninInProgress}
            />
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    buttonContainer: {
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        width: screenWidth >= 768 ? '50%' : '100%',
        alignSelf: screenWidth >= 768 ? 'center' : 'flex-start',
    },
    googleButton: {
        height: 58,
        width:'100%',
        alignSelf: 'stretch',
        marginBottom: 24,
    },
});

export default GoogleSignIn;
