import { Routes, Route } from 'react-router-dom'
import UserPage from "./pages/UserPage"
import AdminPage from "./AdminPageTableExample"
import AdminPageDorm from "./pages/AdminPageDorm"

export default function App() {
  return (
    <Routes>
      <Route path="/user" element={<UserPage />} />
      <Route path="/table" element={<AdminPageDorm />} />
    </Routes>
  )
}