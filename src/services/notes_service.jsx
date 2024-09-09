const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createNote = async (noteData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error("Failed to create note");
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateNote = async (noteId, noteData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error("Failed to update note");
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteNote = async (noteId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete note");
    }

    const data = await response.json();
    return { success: true, data: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const listNotes = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to list notes");
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
