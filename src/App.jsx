import { Route, Routes } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import HomePage from './pages/HomePage.jsx'
import StudentSigninPage from './pages/StudentSigninPage.jsx'
import MyPage from './pages/MyPage.jsx'
import RollingPaperPage from './pages/RollingPaperPage.jsx'
import AppTopBar from './components/common/AppTopBar.jsx'

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppTopBar />

      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/signin" element={<StudentSigninPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/roll/:rollUrl/join" element={<RollingPaperPage />} />
        </Routes>
      </Container>
    </Box>
  )
}
