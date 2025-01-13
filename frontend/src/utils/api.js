// src/utils/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchResources() {
  const response = await fetch(`${API_BASE_URL}/resources`);
  if (!response.ok) {
    throw new Error('Failed to fetch resources');
  }
  return response.json();
}

export async function fetchAllocations() {
  const response = await fetch(`${API_BASE_URL}/allocations`);
  if (!response.ok) {
    throw new Error('Failed to fetch allocations');
  }
  return response.json();
}

export async function createResource(data) {
  const response = await fetch(`${API_BASE_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create resource');
  }
  return response.json();
}

export async function updateResource(id, data) {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update resource');
  }
  return response.json();
}

export async function createAllocation(data) {
  const response = await fetch(`${API_BASE_URL}/allocations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create allocation');
  }
  return response.json();
}