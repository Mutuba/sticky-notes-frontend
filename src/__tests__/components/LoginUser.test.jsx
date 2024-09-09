import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { AuthContext } from "../../context/AuthContext";
import LoginUser from "../../components/auth/LoginUser";
import * as router from "react-router";

const navigate = vi.fn();

beforeEach(() => {
  vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("LoginUser Component", () => {
  const mockLogin = vi.fn();
  const user = null;
  const loading = false;

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ login: mockLogin, user, loading }}>
        <LoginUser />
      </AuthContext.Provider>
    );

  test("renders the login form", () => {
    renderComponent();

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
  });

  test("calls login function on form submission with email and password", async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  test("displays error message when login fails", async () => {
    mockLogin.mockReturnValueOnce({
      success: false,
      message: "Invalid credentials",
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  test("navigates to home when user is already logged in", () => {
    render(
      <Router>
        <AuthContext.Provider
          value={{
            login: mockLogin,
            user: { email: "test@example.com" },
            loading,
          }}
        >
          <LoginUser />
        </AuthContext.Provider>
      </Router>
    );

    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("displays 'Signing In...' button text when loading", () => {
    render(
      <AuthContext.Provider value={{ login: mockLogin, user, loading: true }}>
        <LoginUser />
      </AuthContext.Provider>
    );

    expect(
      screen.getByRole("button", { name: /Signing In.../i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("navigates to home page on successful login with correct credentials", async () => {
    mockLogin.mockReturnValueOnce({ success: true });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "correct@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});
