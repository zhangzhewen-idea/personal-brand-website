export type AppEnvironment = 'dev' | 'prod'

const backendPorts: Record<AppEnvironment, number> = {
  dev: 8080,
  prod: 8088,
}

const productionBackendBaseUrl = 'https://pbw-backend1.harmonies.cc'

export function getEnvironmentConfig(mode: string) {
  if (mode !== 'dev' && mode !== 'prod') {
    throw new Error(`不支持的运行环境: ${mode}`)
  }

  const backendPort = backendPorts[mode]
  const backendTarget = mode === 'prod'
    ? productionBackendBaseUrl
    : `http://localhost:${backendPort}`

  return {
    apiBaseUrl: mode === 'dev' ? '/api' : `${productionBackendBaseUrl}/api`,
    mediaBaseUrl: mode === 'prod' ? productionBackendBaseUrl : backendTarget,
    backendTarget,
    backendPort,
  }
}
