export function getToken() {
  return localStorage.getItem('authToken')
}

export function getRole() {
  return localStorage.getItem('role') // 'kunde' | 'vermieter'
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('role')
}
