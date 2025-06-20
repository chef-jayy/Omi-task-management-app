import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
// import TaskList from './components/TaskList'; // Will be added in Phase 3

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false); // To explicitly show/hide auth form

  useEffect(() => {
    // If not loading and no user, show auth form initially
    if (!loading && !user) {
      setShowAuth(true);
    }
  }, [loading, user]);

  const handleAuthSuccess = () => {
    setShowAuth(false); // Hide auth form on successful login/register
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; // Simple loading indicator
  }

  return (
    <div className="app-container">
      {user ? (
        <>
          <header className="app-header">
            <h1>Welcome, {user.username}!</h1>
            <button onClick={useAuth().logout}>Logout</button>
          </header>
          {/* TaskList component will go here in Phase 3 */}
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "var(--primary-color)",
            }}
          >
            User ID: {user.id}
            <br />
            This is your personalized task list. (More functionality coming
            soon!)
          </p>
        </>
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
