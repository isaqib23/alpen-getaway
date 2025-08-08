import { apiClient } from './client'

export interface CmsPage {
  id: string
  slug: string
  title: string
  meta_title?: string
  meta_description?: string
  content: string
  featured_image_url?: string
  page_type: PageType
  status: PageStatus
  sort_order: number
  is_in_menu: boolean
  menu_title?: string
  created_by: string
  created_at: string
  updated_at: string
  creator: {
    first_name: string
    last_name: string
  }
}

export interface CreateCmsPageRequest {
  slug: string
  title: string
  meta_title?: string
  meta_description?: string
  content: string
  featured_image_url?: string
  page_type: PageType
  sort_order?: number
  is_in_menu?: boolean
  menu_title?: string
}

export interface UpdateCmsPageRequest {
  slug?: string
  title?: string
  meta_title?: string
  meta_description?: string
  content?: string
  featured_image_url?: string
  page_type?: PageType
  status?: PageStatus
  sort_order?: number
  is_in_menu?: boolean
  menu_title?: string
}

export interface CmsPagesResponse {
  data: CmsPage[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CmsStatsResponse {
  byStatus: {
    draft: number
    published: number
    archived: number
  }
  byType: {
    page: number
    blog: number
    help: number
    legal: number
  }
  recentPages: Array<{
    id: string
    title: string
    slug: string
    status: string
    createdAt: string
    creatorName: string
  }>
}

export enum PageType {
  PAGE = 'page',
  BLOG = 'blog',
  HELP = 'help',
  LEGAL = 'legal',
}

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface CmsPageFilters {
  page?: number
  limit?: number
  page_type?: PageType | string
  status?: PageStatus | string
  search?: string
}

class CmsAPI {
  private readonly basePath = '/cms'

  async getPages(filters: CmsPageFilters = {}): Promise<CmsPagesResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.page_type) params.append('page_type', filters.page_type)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}/pages?${queryString}` : `${this.basePath}/pages`
    
    const response = await apiClient.get(url)
    return response.data
  }

  async getPageById(id: string): Promise<CmsPage> {
    const response = await apiClient.get(`${this.basePath}/pages/${id}`)
    return response.data
  }

  async getPageBySlug(slug: string): Promise<CmsPage> {
    const response = await apiClient.get(`${this.basePath}/pages/slug/${slug}`)
    return response.data
  }

  async createPage(pageData: CreateCmsPageRequest): Promise<CmsPage> {
    const response = await apiClient.post(`${this.basePath}/pages`, pageData)
    return response.data
  }

  async updatePage(id: string, pageData: UpdateCmsPageRequest): Promise<CmsPage> {
    const response = await apiClient.patch(`${this.basePath}/pages/${id}`, pageData)
    return response.data
  }

  async deletePage(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/pages/${id}`)
  }

  async publishPage(id: string): Promise<CmsPage> {
    const response = await apiClient.patch(`${this.basePath}/pages/${id}/publish`)
    return response.data
  }

  async unpublishPage(id: string): Promise<CmsPage> {
    const response = await apiClient.patch(`${this.basePath}/pages/${id}/unpublish`)
    return response.data
  }

  async getStats(): Promise<CmsStatsResponse> {
    const response = await apiClient.get(`${this.basePath}/stats`)
    return response.data
  }

  async getMenuPages(): Promise<CmsPage[]> {
    const response = await apiClient.get(`${this.basePath}/menu`)
    return response.data
  }

  // Helper methods for specific page types
  async getCmsPages(filters: Omit<CmsPageFilters, 'page_type'> = {}): Promise<CmsPagesResponse> {
    return this.getPages({ ...filters, page_type: PageType.PAGE })
  }

  async getBlogPosts(filters: Omit<CmsPageFilters, 'page_type'> = {}): Promise<CmsPagesResponse> {
    return this.getPages({ ...filters, page_type: PageType.BLOG })
  }

  async getHelpPages(filters: Omit<CmsPageFilters, 'page_type'> = {}): Promise<CmsPagesResponse> {
    return this.getPages({ ...filters, page_type: PageType.HELP })
  }

  async getLegalPages(filters: Omit<CmsPageFilters, 'page_type'> = {}): Promise<CmsPagesResponse> {
    return this.getPages({ ...filters, page_type: PageType.LEGAL })
  }

  async createCmsPage(pageData: Omit<CreateCmsPageRequest, 'page_type'>): Promise<CmsPage> {
    return this.createPage({ ...pageData, page_type: PageType.PAGE })
  }

  async createBlogPost(pageData: Omit<CreateCmsPageRequest, 'page_type'>): Promise<CmsPage> {
    return this.createPage({ ...pageData, page_type: PageType.BLOG })
  }

  async createHelpPage(pageData: Omit<CreateCmsPageRequest, 'page_type'>): Promise<CmsPage> {
    return this.createPage({ ...pageData, page_type: PageType.HELP })
  }

  async createLegalPage(pageData: Omit<CreateCmsPageRequest, 'page_type'>): Promise<CmsPage> {
    return this.createPage({ ...pageData, page_type: PageType.LEGAL })
  }
}

export const cmsAPI = new CmsAPI()