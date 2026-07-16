import {
  materialPresentation,
  matrixPresentation,
  videoPresentation,
} from '@/configs/home.config'
import {
  basicInfoMock,
  materialMocks,
  matrixAccountMocks,
  videoMocks,
} from '@/mocks/content.mock'
import type {
  HomeContent,
  MaterialCardViewModel,
  MatrixAccountViewModel,
  VideoCardViewModel,
} from '@/models'

function mergeVideo(id: number): VideoCardViewModel {
  const video = videoMocks.find((item) => item.id === id)
  const presentation = videoPresentation[id]

  if (!video || !presentation) {
    throw new Error(`视频 ${id} 缺少展示配置`)
  }

  return { ...video, ...presentation }
}

function mergeMaterial(id: number): MaterialCardViewModel {
  const material = materialMocks.find((item) => item.id === id)
  const presentation = materialPresentation[id]

  if (!material || !presentation) {
    throw new Error(`素材 ${id} 缺少展示配置`)
  }

  return { ...material, ...presentation }
}

function mergeMatrixAccount(id: number): MatrixAccountViewModel {
  const account = matrixAccountMocks.find((item) => item.id === id)
  const presentation = matrixPresentation[id]

  if (!account || !presentation) {
    throw new Error(`矩阵账号 ${id} 缺少展示配置`)
  }

  return { ...account, ...presentation }
}

export async function getHomeContent(): Promise<HomeContent> {
  const basicInfo = basicInfoMock.isDeleted ? undefined : basicInfoMock

  if (!basicInfo) {
    throw new Error('站点基础信息不存在')
  }

  const videos = videoMocks.filter((item) => !item.isDeleted).map((item) => mergeVideo(item.id))
  const materials = materialMocks
    .filter((item) => !item.isDeleted)
    .map((item) => mergeMaterial(item.id))
  const matrixAccounts = matrixAccountMocks
    .filter((item) => !item.isDeleted)
    .map((item) => mergeMatrixAccount(item.id))

  return structuredClone({ basicInfo, videos, materials, matrixAccounts })
}
