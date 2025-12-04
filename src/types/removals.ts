// Types for Content Removals

export type RemovalStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type ContentType = 'image' | 'video' | 'post'

export interface ContentRemoval {
    id: string
    creatorId: string
    creatorName?: string // Solo en listados de admin
    platform: string
    contentUrl: string
    contentType: ContentType | null
    status: RemovalStatus
    reportedAt: string
    resolvedAt: string | null
    description: string | null
    adminNotes: string | null
    createdAt: string
    updatedAt: string
}

export interface CreateRemovalData {
    creatorId: string
    platform: string
    contentUrl: string
    contentType?: ContentType
    status: RemovalStatus
    description?: string
    adminNotes?: string
}

export interface UpdateRemovalData {
    status?: RemovalStatus
    resolvedAt?: string | null
    adminNotes?: string
    description?: string
}

export interface RemovalFilters {
    creatorId?: string
    status?: RemovalStatus | 'all'
    platform?: string | 'all'
    page?: number
    limit?: number
}

export interface PaginatedResponse<T> {
    success: boolean
    data: {
        removals: T[]
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
    }
}
