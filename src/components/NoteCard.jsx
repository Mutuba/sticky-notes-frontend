import { useRef, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteButton from "./DeleteButton";
import { setNewOffset, autoGrow, setZIndex } from "../utils";
import Spinner from "../icons/Spinner";
import { NotesContext } from "../context/NotesContext";
import { AuthContext } from "../context/AuthContext";
import { updateNote } from "../services/notes_service";

const NoteCard = ({ note }) => {
  const [saving, setSaving] = useState(false);
  const [position, setPosition] = useState(note.position);
  const colors = note.colors;
  const body = note.body;
  const textAreaRef = useRef(null);
  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = useRef(null);
  const keyUpTimer = useRef(null);
  const { setSelectedNote } = useContext(NotesContext);
  const { userToken } = useContext(AuthContext);

  const handleKeyUp = async () => {
    setSaving(true);

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      setSelectedNote(note);

      setZIndex(cardRef.current);
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  const saveData = async (key, value) => {
    const payload = { [key]: value };
    setSaving(true);

    try {
      const response = await updateNote(note._id, payload, userToken);

      if (!response.success) {
        throw new Error(response.error);
      }
    } catch (error) {
      const toastId = "save-note-error";
      toast.dismiss(toastId);
      toast.error(error.message, {
        toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
    const newPosition = setNewOffset(cardRef.current);
    saveData("position", newPosition);
  };

  const mouseMove = (e) => {
    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  };

  return (
    <div
      data-testid="note-card"
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        onMouseDown={mouseDown}
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton noteId={note._id} />

        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />

            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
          ref={textAreaRef}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          style={{ color: colors.colorText }}
          defaultValue={body}
        ></textarea>
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  setNotes: PropTypes.func,
  note: PropTypes.shape({
    _id: PropTypes.string,
    body: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    colors: PropTypes.shape({
      id: PropTypes.string,
      colorHeader: PropTypes.string,
      colorText: PropTypes.string,
      colorBody: PropTypes.string,
    }),
  }),
};

export default NoteCard;
