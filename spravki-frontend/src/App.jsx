import { Routes, Route } from 'react-router-dom'
import UserPage from "./oldpages/UserPage"
import AdminPage from "./AdminPageTableExample"
import AdminPageDorm from "./oldpages/AdminPageDorm"
import {EducationalPage, CSDPage, HostelPage} from './pages/UserPages'

export default function App() {
  return (
    <Routes>
      <Route path="/user" element={<UserPage />} />
      <Route path="/table" element={<AdminPageDorm />} />
      <Route path="/edu" element={<EducationalPage />}/>
      <Route path="/csd" element={<CSDPage />}/>
      <Route path="/hostel" element={<HostelPage />}/>
    </Routes>
  )
}