import { Routes, Route } from 'react-router-dom'
import {EducationalPage, CSDPage, HostelPage} from './pages/UserPages'
import AdminPage from './pages/AdminPage'
import RequireAuth from './auth/RequireAuth'
import { AuthCallback } from 'auth-lib'

export default function App() {
  return (
    <Routes>
      <Route path="/auth/callback" element={
        <AuthCallback fallbackPath="/spravki/edu" />
      } />
      <Route path="/spravki/edu_table" element={<RequireAuth><AdminPage department="educational_department" /></RequireAuth>} />
      <Route path="/spravki/csd_table" element={<RequireAuth><AdminPage department="competitive_selection_department" /></RequireAuth>} />
      <Route path="/spravki/hostel_table" element={<RequireAuth><AdminPage department="dormitory" /></RequireAuth>} />
      <Route path="/spravki/edu" element={<RequireAuth><EducationalPage /></RequireAuth>}/>
      <Route path="/spravki/csd" element={<RequireAuth><CSDPage /></RequireAuth>}/>
      <Route path="/spravki/hostel" element={<RequireAuth><HostelPage /></RequireAuth>}/>
    </Routes>
  )
}
