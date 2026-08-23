import { Routes, Route } from 'react-router-dom'
import {EducationalPage, CSDPage, HostelPage} from './pages/UserPages'
import AdminPage from './pages/AdminPage'
import RequireAuth from './auth/RequireAuth'
import { AuthCallback, AuthProvider } from 'auth-lib'
import { authConfig } from './auth/authConfig'

export default function App() {
  return (
    <AuthProvider config={authConfig}>
      <Routes>
        <Route path="/auth/callback" element={
          <AuthCallback fallbackPath="/edu" />
        } />
        <Route path="/edu_table" element={<RequireAuth><AdminPage department="educational_department" /></RequireAuth>} />
        <Route path="/csd_table" element={<RequireAuth><AdminPage department="competitive_selection_department" /></RequireAuth>} />
        <Route path="/hostel_table" element={<RequireAuth><AdminPage department="dormitory" /></RequireAuth>} />
        <Route path="/edu" element={<RequireAuth><EducationalPage /></RequireAuth>}/>
        <Route path="/csd" element={<RequireAuth><CSDPage /></RequireAuth>}/>
        <Route path="/hostel" element={<RequireAuth><HostelPage /></RequireAuth>}/>
      </Routes>
    </AuthProvider>
  )   
}
