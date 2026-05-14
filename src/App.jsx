import { Routes, Route } from 'react-router-dom'
import {EducationalPage, CSDPage, HostelPage} from './pages/UserPages'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/edu_table" element={<AdminPage department="Educational" />} />
      <Route path="/csd_table" element={<AdminPage department="CSD" />} />
      <Route path="/hostel_table" element={<AdminPage department="hostel" />} />
      <Route path="/edu" element={<EducationalPage />}/>
      <Route path="/csd" element={<CSDPage />}/>
      <Route path="/hostel" element={<HostelPage />}/>
    </Routes>
  )
}