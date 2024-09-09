import { useState } from "react";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotesContext } from "../../context/NotesContext";
import { AuthContext } from "../../context/AuthContext";
import NotesPage from "../../pages/NotesPage";
import { notes as initialNotes, user } from "../../assets/mockData";
import { mockFetch } from "../fetchMocks";

const userToken = "random-token";
const mockAuthContext = { user, userToken };

const renderWithContext = (component) => {
  const Wrapper = () => {
    const [notes, setNotes] = useState(initialNotes);

    return (
      <AuthContext.Provider value={mockAuthContext}>
        <NotesContext.Provider value={{ notes, setNotes }}>
          <MemoryRouter>{component}</MemoryRouter>
        </NotesContext.Provider>
      </AuthContext.Provider>
    );
  };

  return render(<Wrapper />);
};

describe("NotesPage Component", () => {
  beforeEach(() => {
    renderWithContext(<NotesPage />);
  });

  test("Should show note cards", async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId("note-card")).toHaveLength(
        initialNotes.length
      );
    });
  });

  test("Should show title", async () => {
    await waitFor(() => {
      const cardText = screen.getAllByText(/Resources:/i);
      expect(cardText[0]).toBeInTheDocument();
    });
  });

  test("Should render controls component with add button", () => {
    expect(screen.getByTestId("controls")).toBeInTheDocument();
    expect(screen.getByTestId("add-button")).toBeInTheDocument();
  });
});

describe("NotesPage Component - Adding a Note", () => {
  beforeEach(() => {
    mockFetch();
    renderWithContext(<NotesPage />);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("adds a new note by clicking on the add button", async () => {
    const addButton = screen.getByTestId("add-button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/The latest note available/i)
      ).toBeInTheDocument();
    });
  });
});
