import { Resource } from "../types/resourceTypes";

const BASE_URL = 'http://backend.localhost/api/resources';

export const fetchResources = async (): Promise<Resource[]> => {
  const response = await fetch(`${BASE_URL}/all`);
  if (!response.ok) {
    throw new Error('Problem fetching resources');
  }
  return response.json();
};