import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography } from '@mui/material'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/student/signin', label: 'StudentSignin' },
  { to: '/mypage', label: 'MyPage' },
]

export default function AppTopBar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sparkle Note
        </Typography>
        {navItems.map((item) => (
          <Typography
            key={item.to}
            component={Link}
            to={item.to}
            color="inherit"
            sx={{ textDecoration: 'none' }}
          >
            {item.label}
          </Typography>
        ))}
      </Toolbar>
    </AppBar>
  )
}
