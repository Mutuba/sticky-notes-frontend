import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import { NotesProvider } from "../../context/NotesContext";
import App from "../../App";
import { mockFetch } from "../fetchMocks";

describe("App Component", () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders Login component since there is no logged in user", async () => {
    render(
      <AuthProvider>
        <NotesProvider>
          <App />
        </NotesProvider>
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: "example@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "TestPassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByText("Sticky Notes")).toBeInTheDocument();
      expect(screen.getByText("The first note")).toBeInTheDocument();
    });
  });
});
