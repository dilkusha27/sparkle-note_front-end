import { Box, Button, Stack } from '@mui/material'
import { getApiBaseUrl } from '../../shared/env/getApiBaseUrl.js'
import naverSocialLogin from '../../assets/images/socialLoginButtons/naverSocialLogin.png'
import kakaoSocialLogin from '../../assets/images/socialLoginButtons/kakaoSocialLogin.png'

function buildOauthUrl(provider) {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, '')
  const apiBase = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`
  return `${apiBase}/oauth2/authorization/${provider}`
}

export default function SocialLoginButtons() {
  const handleProviderLogin = (provider) => {
    window.location.assign(buildOauthUrl(provider))
  }

  return (
    <Stack spacing={1.5}>
      <Button
        type="button"
        variant="text"
        onClick={() => handleProviderLogin('naver')}
        sx={{ p: 0, minWidth: 0, justifyContent: 'flex-start' }}
      >
        <Box
          component="img"
          src={naverSocialLogin}
          alt="네이버 로그인"
          sx={{ width: 260, maxWidth: '100%', display: 'block' }}
        />
      </Button>
      <Button
        type="button"
        variant="text"
        onClick={() => handleProviderLogin('kakao')}
        sx={{ p: 0, minWidth: 0, justifyContent: 'flex-start' }}
      >
        <Box
          component="img"
          src={kakaoSocialLogin}
          alt="카카오 로그인"
          sx={{ width: 260, maxWidth: '100%', display: 'block' }}
        />
      </Button>
    </Stack>
  )
}
