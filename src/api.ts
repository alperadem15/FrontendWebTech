// src/api.ts

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken')

  // Header vorbereiten
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  const res = await fetch(`https://webtech-in4o.onrender.com${url}`, {
    ...options,
    headers
  })

  if (!res.ok) {
    // Optional: 401 automatisch logout
    if (res.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('role')
      window.location.href = '/' // einmal umleiten
    }
    throw new Error(`HTTP ${res.status}`)
  }

  // Automatisch JSON zurückgeben, falls Inhalt da ist
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
