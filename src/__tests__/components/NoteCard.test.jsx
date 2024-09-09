import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NoteCard from "../../components/NoteCard";
import { NotesContext } from "../../context/NotesContext";
import { AuthContext } from "../../context/AuthContext";
import { deleteNote } from "../../services/notes_service";

const userToken = "random-token";
const setSelectedNoteMock = vi.fn();
const setNotesMock = vi.fn();

const mockNotesContext = {
  setSelectedNote: setSelectedNoteMock,
  setNotes: setNotesMock,
};
vi.mock("../../services/notes_service", () => ({
  deleteNote: vi.fn(() => Promise.resolve({ success: true })),
}));

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

describe("NoteCards Component", () => {
  const note = {
    _id: "3",
    body: "You Don't Know JS: Scope & Closures",
    colors: {
      id: "color-yellow",
      colorHeader: "#FFEFBE",
      colorBody: "#FFF5DF",
      colorText: "#18181A",
    },
    position: { x: 605, y: 500 },
  };

  it("renders the correct number of NoteCard components", () => {
    renderWithContext(<NoteCard note={note} />);
    expect(
      screen.getByText("You Don't Know JS: Scope & Closures")
    ).toBeInTheDocument();
    expect(screen.getByTestId("note-card")).toBeInTheDocument();
  });

  it("deletes the note when the delete button is clicked", async () => {
    renderWithContext(<NoteCard note={note} />);

    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith(note._id, userToken);
    });

    expect(setNotesMock).toHaveBeenCalled();
  });
});
