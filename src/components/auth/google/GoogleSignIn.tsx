import { useContext, useState } from 'react';
import type { ReactElement } from 'react';
import {
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
        <View>
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

const styles = StyleSheet.create({
    googleButton: {
        width: 192,
        height: 48,
        alignSelf: 'center',
        marginBottom: 24,
    },
});

export default GoogleSignIn;
