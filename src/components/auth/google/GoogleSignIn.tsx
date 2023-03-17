import  { useState } from 'react';
import type { ReactElement } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import React from 'react';
import { googleLogin } from '../../../services/authServices/googleAuthServices';

interface User {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    idToken?: string | null;
}

const GoogleSignIn = (): ReactElement => {
    const [user, setUser] = useState<User | null>(null);
    const [isSigninInProgress, setIsSigninInProgress] = useState(false);

    GoogleSignin.configure({
        webClientId: '277866648441-artsud3slcaflj9v7tkeeds2m15g2bc7.apps.googleusercontent.com',
    });

    const onGoogleButtonPress = async () => {
        setIsSigninInProgress(true);

        try {
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            googleLogin(googleCredential.providerId, googleCredential.token)
            // console.log(111, googleCredential);
            
            // const userCredential: FirebaseAuthTypes.UserCredential = await auth().signInWithCredential(googleCredential);
            // console.log(222, userCredential);
            
            // const firebaseUser: FirebaseAuthTypes.User | null = userCredential.user;

            // if (firebaseUser) {
            //     setUser({
            //         email: firebaseUser.email,
            //         photoURL: firebaseUser.photoURL,
            //         displayName: firebaseUser.displayName,
            //         idToken: idToken
            //     });
            // }
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
            {user ? (
                <View>
                    <Text>Email: {user.email}</Text>
                    <Text>id Token: {user.idToken}</Text>
                </View>
            ) : (
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={onGoogleButtonPress}
                    disabled={isSigninInProgress}
                />
            )}
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
