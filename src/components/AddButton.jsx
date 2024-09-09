import { useRef, useContext } from "react";
import Plus from "../icons/Plus";
import colors from "../assets/colors.json";
import { NotesContext } from "../context/NotesContext";
import { AuthContext } from "../context/AuthContext";
import { createNote } from "../services/notes_service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddButton = () => {
  const startingPos = useRef(10);
  const { setNotes } = useContext(NotesContext);
  const { userToken } = useContext(AuthContext);

  const addNote = async () => {
    const payload = {
      position: {
        x: startingPos.current,
        y: startingPos.current,
      },
      colors: colors[0],
    };

    startingPos.current += 10;

    try {
      const response = await createNote(payload, userToken);
      if (response.success) {
        setNotes((prevState) => [response.data, ...prevState]);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      const toastId = "create-note-error-toast";
      toast.dismiss(toastId);
      toast.error(error.message, { toastId });
    }
  };

  return (
    <div id="add-btn" data-testid="add-button" onClick={addNote}>
      <Plus />
    </div>
  );
};

export default AddButton;
