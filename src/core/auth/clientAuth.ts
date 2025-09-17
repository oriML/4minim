'use client';

export function getAuthTokenClient(): string | null {
  return localStorage.getItem('jwtToken');
}

export function setAuthTokenClient(token: string): void {
  localStorage.setItem('jwtToken', token);
}

export function removeAuthTokenClient(): void {
  localStorage.removeItem('jwtToken');
}