import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import Modal from "react-native-modal";

export interface Props {
    error: string;
    togglePopup: () => void;
    popupVisible: boolean;
}

const Popup = ({ error, togglePopup, popupVisible }: Props) => {

    return (
        <Modal isVisible={popupVisible}>
            <View testID='overlay' style={styles.overlay}>
                <View style={styles.alert}>
                    <Text style={styles.message}>{error}</Text>
                    <TouchableOpacity onPress={togglePopup} style={styles.button}>
                        <Text testID='close-button' style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}


const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    overlay: {
        display: "flex",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        width: screenWidth >= 768 ? '50%' : '100%',
        alignSelf: screenWidth >= 768 ? 'center' : 'flex-start',
    },
    alert: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "space-evenly",
        flexDirection: "column",
    },
    message: {
        fontSize: 16,
        marginBottom: 20
    },
    button: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Popup;