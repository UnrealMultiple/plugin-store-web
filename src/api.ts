import axios from 'axios'
import type { ApiResp, PluginDetail, PluginListData, RateData } from './plugin'

// 生产环境可通过 VITE_API_BASE 指定后端地址; 开发环境默认走 vite 代理(见 vite.config.ts)
const BASE_URL: string = import.meta.env.VITE_API_BASE ?? ''

const client = axios.create({ baseURL: BASE_URL })

function unwrap<T>(resp: ApiResp<T>): T {
  if (resp.code !== 0) {
    throw new Error(resp.msg)
  }
  return resp.data as T
}

export interface SearchParams {
  keyword?: string
  page?: number
  page_size?: number
}

export async function searchPlugins(params: SearchParams = {}): Promise<PluginListData> {
  const { data } = await client.get<ApiResp<PluginListData>>('/api/v1/plugin/search', { params })
  return unwrap(data)
}

export async function getPluginDetail(id: number): Promise<PluginDetail> {
  const { data } = await client.get<ApiResp<PluginDetail>>(`/api/v1/plugin/${id}/detail`)
  return unwrap(data)
}

export async function ratePlugin(pluginId: number, score: number): Promise<RateData> {
  const { data } = await client.post<ApiResp<RateData>>('/api/v1/plugin/rate', {
    plugin_id: pluginId,
    score: score,
  })
  return unwrap(data)
}

export function getPluginDownloadLink(id: number, version?: string): string {
  const url = `${BASE_URL}/api/v1/plugin/${id}/download`
  return version ? `${url}?version=${encodeURIComponent(version)}` : url
}

export function getDownloadAllLink(): string {
  return `${BASE_URL}/api/v1/plugin/download_all`
}

export function getPluginDocLink(assemblyName: string): string {
  return `https://docs.terraria.ink/zh/guide/${encodeURIComponent(assemblyName)}`
}
