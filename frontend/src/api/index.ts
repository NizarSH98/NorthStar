import { Evidence, Claim, Relationship, AuditEvent, ApiResponse, Source } from '../types';

const API_BASE = '/api';

export const api = {
  // Evidence endpoints
  async getEvidence(params?: {
    page?: number;
    perPage?: number;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<Evidence[]>> {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE}/evidence?${queryString}`);
    return response.json();
  },

  async getEvidenceById(id: string): Promise<ApiResponse<Evidence>> {
    const response = await fetch(`${API_BASE}/evidence/${id}`);
    return response.json();
  },

  // Claim endpoints
  async getClaims(params?: {
    page?: number;
    perPage?: number;
  }): Promise<ApiResponse<Claim[]>> {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE}/claims?${queryString}`);
    return response.json();
  },

  async getClaimById(id: string): Promise<ApiResponse<Claim>> {
    const response = await fetch(`${API_BASE}/claims/${id}`);
    return response.json();
  },

  // Relationship endpoints
  async getRelationships(params?: {
    observedOnly?: boolean;
    relationshipType?: string;
    entityId?: string;
  }): Promise<ApiResponse<Relationship[]>> {
    const queryParams: Record<string, string> = {};
    if (params?.observedOnly !== undefined) {
      queryParams.observedOnly = String(params.observedOnly);
    }
    if (params?.relationshipType) {
      queryParams.relationshipType = params.relationshipType;
    }
    if (params?.entityId) {
      queryParams.entityId = params.entityId;
    }
    
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${API_BASE}/relationships?${queryString}`);
    return response.json();
  },

  // Audit endpoints
  async getAuditTrail(entityType: string, entityId: string): Promise<ApiResponse<AuditEvent[]>> {
    const response = await fetch(`${API_BASE}/audit/${entityType}/${entityId}`);
    return response.json();
  },

  async getAllAuditEvents(): Promise<ApiResponse<AuditEvent[]>> {
    const response = await fetch(`${API_BASE}/audit`);
    return response.json();
  },

  // Source endpoints
  async getSources(): Promise<ApiResponse<Source[]>> {
    const response = await fetch(`${API_BASE}/sources`);
    return response.json();
  },

  async getSourceById(id: string): Promise<ApiResponse<Source>> {
    const response = await fetch(`${API_BASE}/sources/${id}`);
    return response.json();
  }
};
