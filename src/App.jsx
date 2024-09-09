import { ToastContainer } from "react-toastify";
import { HashRouter, Routes, Route } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import { NotesProvider } from "./context/NotesContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar";

const App = () => {
  return (
    <div id="app">
      <AuthProvider>
        <NotesProvider>
          <HashRouter>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Navbar />
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<NotesPage />} />
            </Routes>
          </HashRouter>
        </NotesProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
