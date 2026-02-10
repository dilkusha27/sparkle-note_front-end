import { Link, Route, Routes } from 'react-router-dom'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import HomePage from './pages/HomePage.jsx'
import StudentSigninPage from './pages/StudentSigninPage.jsx'
import MyPage from './pages/MyPage.jsx'

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sparkle Note
          </Typography>
          <Typography component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
            Home
          </Typography>
          <Typography
            component={Link}
            to="/student/signin"
            color="inherit"
            sx={{ textDecoration: 'none' }}
          >
            StudentSignin
          </Typography>
          <Typography
            component={Link}
            to="/mypage"
            color="inherit"
            sx={{ textDecoration: 'none' }}
          >
            MyPage
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/signin" element={<StudentSigninPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Container>
    </Box>
  )
}
