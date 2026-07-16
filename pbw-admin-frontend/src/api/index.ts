/** 后台 API 统一入口，后续按业务域扩展。 */
export { HttpError, http, normalizeHttpError } from './http'
export { auth, basicInfo, courses, materials, matrixAccounts, users, videos } from './endpoints'
export {
  courseApi,
  materialApi,
  matrixAccountApi,
  userApi,
  videoApi,
} from './modules'
