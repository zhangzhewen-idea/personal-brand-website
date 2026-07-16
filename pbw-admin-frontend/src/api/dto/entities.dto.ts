export interface AuditDto {
  id: number
  create_time: string
  update_time: string
  is_deleted: 0 | 1
}

export interface BasicInfoDto extends AuditDto {
  home_cover_video: string | null
  contact_email: string | null
  contact_qr_code: string | null
  total_play_count: number
  total_like_count: number
  total_follower_count: number
  author_identity_tag: string | null
  slogan: string | null
  creation_attitude: string | null
  author_photo: string | null
  editing_desk_work_photo: string | null
  asset_library_screenshot: string | null
  daily_movie_watching_photo: string | null
  annual_top_10_films: string | string[] | null
  influential_three_directors: string | string[] | null
  contact_info: string | null
}

export interface VideoDto extends AuditDto {
  video_title: string
  video_intro: string | null
  video_url: string
  video_cover: string | null
}

export interface MaterialDto extends AuditDto {
  material_title: string
  material_photo: string | null
  material_intro: string | null
  price: number | string
  netdisk_url: string | null
}

export interface MatrixAccountDto extends AuditDto {
  platform_name: string
  platform_logo: string | null
  account_url: string | null
  intro: string | null
}

export interface CourseDto extends AuditDto {
  course_name: string
  course_tag: string | null
  course_intro: string | null
  course_price: number | string
  is_online: 0 | 1
}

export interface UserDto extends AuditDto {
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: '用户' | '管理员'
}
