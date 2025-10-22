import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import './App.css'
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/forgotpassword' element={<ForgotPassword/>} />
        <Route path='*' element={<h1 className='text-center mt-20 text-3xl'>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App
