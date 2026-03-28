import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ScannerProvider } from './context/ScannerContext';
import CssBaseline from '@mui/material/CssBaseline';

// Components & Pages
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SolderingProjects from './pages/SolderingProjects';
import VideoTutorials from './pages/VideoTutorials';
import ProjectFolders from './pages/ProjectFolders';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
    return (
        <>
            <CssBaseline />
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/soldering" 
                    element={
                        <ProtectedRoute>
                            <SolderingProjects />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/tutorials" 
                    element={
                        <ProtectedRoute>
                            <VideoTutorials />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/folders" 
                    element={
                        <ProtectedRoute>
                            <ProjectFolders />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <ScannerProvider>
                <Router>
                    <AppContent />
                </Router>
            </ScannerProvider>
        </AuthProvider>
    );
}

export default App;