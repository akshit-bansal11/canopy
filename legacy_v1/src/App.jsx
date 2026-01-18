import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Lazy load components
const AuthenticatedApp = lazy(() => import('./components/AuthenticatedApp.jsx'));
const AuthPage = lazy(() => import('./components/AuthPage.jsx'));

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-muted)]">
        Loading...
      </div>
    }>
      {currentUser ? <AuthenticatedApp /> : <AuthPage />}
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;