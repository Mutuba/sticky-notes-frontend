import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mockFetch } from "../fetchMocks";
import { NotesContext } from "../../context/NotesContext";
import { AuthContext } from "../../context/AuthContext";
import AddButton from "../../components/AddButton";

const setNotesMock = vi.fn();
const mockAuthContext = { userToken: "random-token" };
const mockNotesContext = { setNotes: setNotesMock };

const renderWithContexts = (component) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <NotesContext.Provider value={mockNotesContext}>
        {component}
      </NotesContext.Provider>
    </AuthContext.Provider>
  );
};

beforeEach(() => {
  mockFetch();
  renderWithContexts(<AddButton />);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AddButton Component", () => {
  it("should render the add button", () => {
    expect(screen.getByTestId("add-button")).toBeInTheDocument();
  });

  it("should call setNotes when the add button is clicked", async () => {
    fireEvent.click(screen.getByTestId("add-button"));

    await waitFor(() => {
      expect(setNotesMock).toHaveBeenCalled();
    });
  });
});
