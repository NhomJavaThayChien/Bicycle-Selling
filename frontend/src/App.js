import { BrowserRouter } from "react-router-dom";
import "./App.css";
import ChatbotWidget from "./components/ChatbotWidget";
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <AppRoutes />
          </main>
          <ChatbotWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
