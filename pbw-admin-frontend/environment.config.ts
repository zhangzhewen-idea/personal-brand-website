export type AppEnvironment = 'dev' | 'prod'

const backendPorts: Record<AppEnvironment, number> = {
  dev: 8080,
  prod: 8088,
}

export function getEnvironmentConfig(mode: string) {
  if (mode !== 'dev' && mode !== 'prod') {
    throw new Error(`不支持的运行环境: ${mode}`)
  }

  const backendPort = backendPorts[mode]
  const backendTarget = `http://localhost:${backendPort}`

  return {
    apiBaseUrl: `${backendTarget}/api`,
    backendTarget,
    backendPort,
  }
}
