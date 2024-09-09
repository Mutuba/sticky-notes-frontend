import { useContext } from "react";
import PropTypes from "prop-types";
import Trash from "../icons/Trash";
import { deleteNote } from "../services/notes_service";
import { NotesContext } from "../context/NotesContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteButton = ({ noteId }) => {
  const { setNotes } = useContext(NotesContext);
  const { userToken } = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      const response = await deleteNote(noteId, userToken);
      if (response.success) {
        setNotes((prevState) =>
          prevState.filter((note) => note._id !== noteId)
        );

        const toastId = "delete-note-success";
        toast.dismiss(toastId);
        toast.error(response.data, {
          toastId,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      const toastId = "delete-note-error";
      toast.dismiss(toastId);
      toast.error(error.message, { toastId });
    }
  };

  return (
    <div data-testid="delete-button" onClick={handleDelete}>
      <Trash />
    </div>
  );
};

DeleteButton.propTypes = {
  noteId: PropTypes.string.isRequired,
};

export default DeleteButton;
