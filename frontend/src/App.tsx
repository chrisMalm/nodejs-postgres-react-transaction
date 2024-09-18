import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LoginForm } from './components/LoginComponent'
import { Home } from './pages/Home'
import { PrivateRoutes } from './utils/PrivateRoutes'
import { AuthProvider } from './contexts/AuthProvider '

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        {' '}
        <Routes>
          <Route element={<PrivateRoutes />}>
            {' '}
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
