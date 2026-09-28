import { apiClient } from './client'
import type { PaginatedResponse } from '@/types/api'
import type { Item } from '@/types/item'

export interface ItemListParams {
  page?: number
  search?: string
  category?: string
  tag?: string
  access_type?: 'free' | 'paid'
  sort?: 'latest' | 'oldest' | 'title'
}

export async function listItems(
  params: ItemListParams = {},
): Promise<PaginatedResponse<Item>> {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page))
  }

  if (params.search) {
    searchParams.set('search', params.search)
  }

  if (params.category) {
    searchParams.set('category', params.category)
  }

  if (params.tag) {
    searchParams.set('tag', params.tag)
  }

  if (params.access_type) {
    searchParams.set('access_type', params.access_type)
  }

  if (params.sort) {
    searchParams.set('sort', params.sort)
  }

  const query = searchParams.toString()

  return apiClient<PaginatedResponse<Item>>(
    `/items${query ? `?${query}` : ''}`,
  )
}

export async function getItem(slug: string): Promise<{ data: Item }> {
  return apiClient<{ data: Item }>(`/items/${encodeURIComponent(slug)}`)
}
