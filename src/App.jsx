import { Routes, Route } from 'react-router-dom'
import {EducationalPage, CSDPage, HostelPage} from './pages/UserPages'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/spravki/edu_table" element={<AdminPage department="Educational" />} />
      <Route path="/spravki/csd_table" element={<AdminPage department="CSD" />} />
      <Route path="/spravki/hostel_table" element={<AdminPage department="hostel" />} />
      <Route path="/spravki/edu" element={<EducationalPage />}/>
      <Route path="/spravki/csd" element={<CSDPage />}/>
      <Route path="/spravki/hostel" element={<HostelPage />}/>
    </Routes>
  )
}