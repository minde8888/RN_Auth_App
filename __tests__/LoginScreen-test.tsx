import { render } from "@testing-library/react-native";
import React from "react";
import LoginScreen from "../src/components/pages/LoginScreen";


describe('<App />', () => {
    test('renders without error', () => {
      const { getByTestId } = render(<LoginScreen />);
    //   const appContainer = getByTestId('app-container');
    //   expect(appContainer).toBeDefined();
    });
  });