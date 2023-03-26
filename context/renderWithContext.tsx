import { store } from "../src/redux/store";
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import React from "react";

export function renderWithContext(element: React.ReactElement) {
    return render(<Provider store={store}>{element}</Provider>);
}
