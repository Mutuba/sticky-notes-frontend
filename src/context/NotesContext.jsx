import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { listNotes } from "../services/notes_service";
import Spinner from "../icons/Spinner";

const NotesContext = createContext();

const NotesProvider = ({ children, initialState }) => {
  const [internalNotes, setInternalNotes] = useState(initialState?.notes ?? []);
  const [internalLoading, setInternalLoading] = useState(
    initialState?.loading ?? true
  );

  const setNotes = initialState?.setNotes ?? setInternalNotes;
  const setLoading = initialState?.setLoading ?? setInternalLoading;
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState(null);
  const { userToken } = useContext(AuthContext);

  const fetchNotes = useCallback(async () => {
    if (!userToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await listNotes(userToken);

      if (response.success) {
        setNotes(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("An error occurred while fetching notes.");
    } finally {
      setLoading(false);
    }
  }, [userToken, setNotes, setLoading]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const contextValue = useMemo(
    () => ({
      notes: internalNotes,
      loading: internalLoading,
      setNotes,
      selectedNote,
      setSelectedNote,
      error,
    }),
    [
      internalNotes,
      internalLoading,
      setNotes,
      selectedNote,
      setSelectedNote,
      error,
    ]
  );

  return (
    <NotesContext.Provider value={contextValue}>
      {internalLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spinner size="100" />
        </div>
      ) : (
        children
      )}
    </NotesContext.Provider>
  );
};

NotesProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.shape({
    setNotes: PropTypes.func,
    setLoading: PropTypes.func,
    loading: PropTypes.bool,
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        body: PropTypes.string,
        colors: PropTypes.shape({
          id: PropTypes.string,
          colorHeader: PropTypes.string,
          colorBody: PropTypes.string,
          colorText: PropTypes.string,
        }),
        position: PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      })
    ),
  }),
};

export { NotesProvider, NotesContext };
