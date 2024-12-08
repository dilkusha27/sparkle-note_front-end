import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/common/App.css';
import LoginPage from './pages/LoginPage';
import StudentSigninPage from './pages/StudentSigninPage';
import MyPage from './pages/MyPage';
import RollingPaperPage from './pages/RollingPaperPage';
import RedirectHandler from './pages/RedirectHandler';

// react-query 적용
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Dev 전용(개발용)
import MyPageDev from './pages/MyPageDev';
import RollingPaperPageDev from './pages/RollingPaperPageDev';
import StudentSigninPageDev from './pages/StudentSigninPageDev';

import { ThemeProvider } from '@mui/material/styles';
import { theme } from './components/MuiColor';
// import store from './store.js'

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

function App() {
  return (
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
    <div className="app-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/oauth/callback" element={<RedirectHandler />} />ㅅ
            <Route path="/:url" element={<StudentSigninPage />} />
            <Route path="/roll/:url/join/" element={<RollingPaperPage />} />

            {process.env.NODE_ENV === 'development' && (
                <Route path="/mypage-dev" element={<MyPageDev/>} />
            )}
            {process.env.NODE_ENV === 'development' && (
                <Route path="/studentsigin-dev" element={<StudentSigninPageDev />} />
            )}
            {process.env.NODE_ENV === 'development' && (
                <Route path="/rolling-paper-dev" element={<RollingPaperPageDev />} />
            )}
          </Routes>
        </BrowserRouter>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>
  );
}

export default App;