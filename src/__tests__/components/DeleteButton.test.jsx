import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { describe, vi, test, expect, beforeEach, afterEach } from "vitest";
import { AuthContext } from "../../context/AuthContext";
import { NotesContext } from "../../context/NotesContext";
import { mockFetch } from "../fetchMocks";
import DeleteButton from "../../components/DeleteButton";

const setNotes = vi.fn();
const userToken = "random-token";
const mockNotesContext = { setNotes };
const mockAuthContext = { userToken };

const renderWithContext = (component) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <NotesContext.Provider value={mockNotesContext}>
        {component}
      </NotesContext.Provider>
    </AuthContext.Provider>
  );
};

beforeEach(() => {
  renderWithContext(<DeleteButton noteId="2" />);
});

describe("DeleteButton component", () => {
  test("it renders the delete button", () => {
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });
});

describe("DeleteButton component - Deleting a Note", () => {
  beforeEach(() => {
    mockFetch();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test("deletes a note by clicking on the delete button", async () => {
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(setNotes).toHaveBeenCalled();
    });
  });
});
