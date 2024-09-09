import { describe, test, expect, beforeEach } from "vitest";
import { mockFetch } from "../fetchMocks";
import {
  createNote,
  updateNote,
  deleteNote,
  listNotes,
} from "../../services/notes_service";

beforeEach(() => {
  mockFetch();
});

describe("Notes Service", () => {
  const mockToken = "test-token";
  const mockNoteId = "5";
  const mockNoteData = {
    body: "A new note",
    colors: { id: "color-blue" },
    position: { x: 100, y: 100 },
  };

  test("createNote should create a new note", async () => {
    const result = await createNote(mockNoteData, mockToken);
    expect(result).toEqual({
      success: true,
      data: {
        _id: "5",
        body: "The latest note available",
        colors: {
          id: "color-blue",
          colorHeader: "#9BD1DE",
          colorBody: "#A6DCE9",
          colorText: "#18181A",
        },
        position: { x: 305, y: 110 },
      },
    });
  });

  test("updateNote should update an existing note", async () => {
    const result = await updateNote(mockNoteId, mockNoteData, mockToken);
    expect(result).toEqual({
      success: true,
      data: {
        _id: parseInt(mockNoteId, 10),
        body: "Hello, world",
        colors: {
          id: "color-blue",
          colorHeader: "#9BD1DE",
          colorBody: "#A6DCE9",
          colorText: "#18181A",
        },
        position: { x: 305, y: 110 },
      },
    });
  });

  test("deleteNote should delete a note", async () => {
    const result = await deleteNote(mockNoteId, mockToken);

    expect(result).toEqual({
      success: true,
      data: "Note removed",
    });
  });

  test("listNotes should fetch a list of notes", async () => {
    const result = await listNotes(mockToken);
    expect(result).toEqual({
      success: true,
      data: [
        {
          _id: "1",
          body: "The first note",
          colors: {
            id: "color-blue",
            colorHeader: "#9BD1DE",
            colorBody: "#A6DCE9",
            colorText: "#18181A",
          },
          position: { x: 305, y: 110 },
        },
        {
          _id: "2",
          body: "The second note",
          colors: {
            id: "color-blue",
            colorHeader: "#9BD1DE",
            colorBody: "#A6DCE9",
            colorText: "#18181A",
          },
          position: { x: 305, y: 110 },
        },
      ],
    });
  });
});
