// 新API统一响应(code/msg平铺)
export interface ApiResp<T> {
  code: number
  msg: string
  data?: T
}

// 插件信息
export interface PluginInfo {
  id: number
  name: string
  description: string
  version: string
  download_url: string
  download_count: number
  rating_count: number
  rating_score: number
  created_at: string
  updated_at: string
  assembly_name: string
  author: string
  descriptions: Record<string, string>
  hot_reload: boolean
  path: string
}

// 插件版本
export interface PluginVersionInfo {
  version: string
  created_at: string
  dependencies: string[]
  hot_reload: boolean
  path: string
}

// 插件详情
export interface PluginDetail {
  plugin: PluginInfo
  versions: PluginVersionInfo[]
}

// 分页数据
export interface PluginListData {
  total: number
  page: number
  page_size: number
  items: PluginInfo[]
}

// 评分结果
export interface RateData {
  rating_count: number
  rating_score: number
}
