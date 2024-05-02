export interface Resource {
    ResourceId: number;
    CompanyId: number;
    Identifier: string;
    Type: string;
    Capacity: number;
  }
  
  export interface ResourcesState {
    resources: Resource[];
    loading: boolean;
    error: string | null;
  }
  