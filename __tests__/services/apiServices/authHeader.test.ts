import { store } from "../../../src/redux/store";
import { authHeader } from "../../../src/services/apiServices/authHeader";


describe("authHeader function", () => {
  test("returns an object with Authorization header when token exists", () => {
    store.getState = jest.fn().mockReturnValue({
      data: {
        auth: { token: "mockToken" },
      },
    });

    const result = authHeader();
    expect(result).toEqual({ Authorization: "Bearer mockToken" });
  });

  test("returns an empty object when token does not exist", () => {
    store.getState = jest.fn().mockReturnValue({
      data: {
        auth: { token: "" },
      },
    });

    const result = authHeader();
    expect(result).toEqual({});
  });
});
