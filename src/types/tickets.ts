// src/types/tickets.ts

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type SenderType = 'CREATOR' | 'ADMIN';

export interface TicketMessage {
    id: string;
    body: string;
    createdAt: string;
    senderType: SenderType;
    userProfileId: string | null;
    userProfile: {
        id: string;
        creatorName: string;
    } | null;
    userId: string | null;
    user: {
        id: string;
        fullName: string;
        username: string;
        role?: string;
    } | null;
    ticketId: string;
}

export interface Ticket {
    id: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
    userProfileId: string;
    userProfile: {
        id: string;
        creatorName: string;
        email: string;
    };
    messages: TicketMessage[];
    _count: { messages: number };
}

export interface TicketMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TicketStats {
    total: number;
    byStatus: {
        OPEN: number;
        IN_PROGRESS: number;
        RESOLVED: number;
        CLOSED: number;
    };
    byPriority: {
        LOW: number;
        MEDIUM: number;
        HIGH: number;
        URGENT: number;
    };
}
