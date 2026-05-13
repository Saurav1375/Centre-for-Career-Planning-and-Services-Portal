
import './index.css';

import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext';
import { useAuthContext } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages Import
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';


// import Home from './pages/Home';
import Dashboard from './pages/Dashboard';


// import HRContactsPage from './pages/student/HRContactsPage';

// Admin Pages Imports
import CallerDashboard from './pages/student/CallerDashboard';

import CallerHRContacts from './pages/student/CallerHRContacts';
import CallerCallLogs from './pages/student/CallerCallLogs';
import CallerProfile from './pages/student/CallerProfile';

//Admin
import HRAssignment from './pages/admin/HRAssignment';
import UserManagement from './pages/admin/UserManagement';
import AdminDashboardPage from './pages/admin/AdminDashboard';
import AdminHRContactsRepository from './pages/admin/AdminContactRepository';
import AdminCallLog from './pages/admin/AdminCallLog'


function App() {
  const { authUser } = useAuthContext();
  const { showForgotPassword, showVerifyEmail } = useAppContext();
  return (
    <>

      {showForgotPassword && <ForgotPassword />}
      {showVerifyEmail && <VerifyEmail />}


      <Routes>

        <Route path="/" element={ authUser ? ( authUser.role === "admin" ? ( <AdminDashboardPage /> ) : ( <CallerDashboard /> ) ) : ( <Navigate to="/login" /> ) } />
        {/* <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} /> */}
        <Route path='/dashboard' element={authUser ? <Dashboard /> : <Navigate to='/login' />} />
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <Signup />} />
        <Route path='/hr-contacts' element={<CallerHRContacts />} />
        <Route path='/caller-dashboard' element={<CallerDashboard />} />
        <Route path='/caller-profile' element={<CallerProfile />} />
        <Route path='/caller-call-logs' element={<CallerCallLogs />} />


        <Route path='/admin/assign-hr-contacts' element={authUser?.role === 'admin' ? <HRAssignment /> : <Navigate to='/' />} />
        <Route path='/admin/user-management' element={authUser?.role === 'admin' ? <UserManagement /> : <Navigate to='/' />} />
        <Route path='/admin/admin-dashboard' element={authUser?.role === 'admin' ? <AdminDashboardPage /> : <Navigate to='/' />} />
        <Route path='/admin/hr-contacts-repository' element={authUser?.role === 'admin' ? <AdminHRContactsRepository /> : <Navigate to='/' />} />
        <Route path='/admin/hr-call-log' element={authUser?.role === 'admin' ? <AdminCallLog /> : <Navigate to='/' />} />s

        {!authUser && <Route path='/reset-password/:resetToken' element={<ResetPasswordPage />} />}


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
