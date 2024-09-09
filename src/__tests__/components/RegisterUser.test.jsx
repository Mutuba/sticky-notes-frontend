import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { AuthContext } from "../../context/AuthContext";
import RegisterUser from "../../components/auth/RegisterUser";
import * as router from "react-router";

const navigate = vi.fn();

beforeEach(() => {
  vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("RegisterUser Component", () => {
  const mockRegister = vi.fn();
  const user = null;
  const loading = false;

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ register: mockRegister, user, loading }}>
        <RegisterUser />
      </AuthContext.Provider>
    );

  test("renders the register form", () => {
    renderComponent();

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  test("calls login function on form submission with username, email and password", async () => {
    renderComponent();
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(usernameInput, { target: { value: "testusername" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    expect(mockRegister).toHaveBeenCalledWith({
      username: "testusername",
      email: "test@example.com",
      password: "password123",
    });
  });

  test("displays error message when register fails", async () => {
    mockRegister.mockReturnValueOnce({
      success: false,
      message: "Invalid credentials",
    });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  test("navigates to home when user is already logged in", () => {
    render(
      <Router>
        <AuthContext.Provider
          value={{
            register: mockRegister,
            user: { email: "test@example.com" },
            loading,
          }}
        >
          <RegisterUser />
        </AuthContext.Provider>
      </Router>
    );

    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("displays 'Signing Up...' button text when loading", () => {
    render(
      <AuthContext.Provider
        value={{ register: mockRegister, user, loading: true }}
      >
        <RegisterUser />
      </AuthContext.Provider>
    );

    expect(
      screen.getByRole("button", { name: /Signing Up.../i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("navigates to home page on successful registration with correct credentials", async () => {
    mockRegister.mockReturnValueOnce({ success: true });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testUsername" },
    });

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "correct@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});
