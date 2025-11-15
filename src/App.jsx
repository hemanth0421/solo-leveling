import { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import { loadUserData } from './utils/storage';

function App() {
  const [username, setUsername] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if username exists in localStorage
    const savedUsername = localStorage.getItem('soloLeveling::currentUser');
    if (savedUsername) {
      const data = loadUserData(savedUsername);
      if (data) {
        setUsername(savedUsername);
        setUserData(data);
      }
    }
  }, []);

  const handleLogin = (newUsername, data) => {
    setUsername(newUsername);
    setUserData(data);
    localStorage.setItem('soloLeveling::currentUser', newUsername);
  };

  const handleLogout = () => {
    setUsername(null);
    setUserData(null);
    localStorage.removeItem('soloLeveling::currentUser');
  };

  if (!username || !userData) {
    return <Welcome onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      userData={userData}
      setUserData={setUserData}
      onLogout={handleLogout}
    />
  );
}

export default App;

