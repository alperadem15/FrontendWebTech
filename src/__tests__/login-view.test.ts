import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'

// ---- Mocks für vue-router ----
const pushMock = vi.fn()
let roleParam: 'kunde' | 'vermieter' = 'kunde'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ params: { role: roleParam } }),
}))

// ---- fetch mock ----
function mockFetchJson(status: number, json: any) {
  const headers = new Headers({ 'content-type': 'application/json' })
  return vi.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    headers,
    text: async () => JSON.stringify(json),
  })) as any
}

function mockFetchFail(status: number) {
  const headers = new Headers({ 'content-type': 'text/plain' })
  return vi.fn(async () => ({
    ok: false,
    status,
    headers,
    text: async () => 'fail',
  })) as any
}

describe('LoginView (Use-Cases)', () => {
  beforeEach(() => {
    pushMock.mockReset()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('Kunde-Login: ruft /kunde/login auf, setzt LocalStorage und navigiert zu /home', async () => {
    roleParam = 'kunde'
    ;(globalThis as any).fetch = mockFetchJson(200, { kundeId: 123, message: 'Login erfolgreich!' })

    const wrapper = mount(LoginView)

    // Inputs setzen
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('kunde@test.de')
    await inputs[1].setValue('Test123!')

    // Submit
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // fetch URL prüfen
    expect((globalThis as any).fetch).toHaveBeenCalledTimes(1)
    const [url, options] = (globalThis as any).fetch.mock.calls[0]
    expect(String(url)).toContain('/kunde/login')
    expect(options.method).toBe('POST')

    // LocalStorage
    expect(localStorage.getItem('authToken')).toBe('ok')
    expect(localStorage.getItem('role')).toBe('kunde')
    expect(localStorage.getItem('userId')).toBe('123')
    expect(localStorage.getItem('vermieterId')).toBe(null)

    // Navigation
    expect(pushMock).toHaveBeenCalledWith('/home')
  })

  it('Vermieter-Login: ruft /vermieter/login auf, setzt LocalStorage und navigiert zu /vermieter/dashboard', async () => {
    roleParam = 'vermieter'
    ;(globalThis as any).fetch = mockFetchJson(200, { vermieterId: 77, message: 'Login erfolgreich!' })

    const wrapper = mount(LoginView)

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('vermieter@test.de')
    await inputs[1].setValue('Test123!')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect((globalThis as any).fetch).toHaveBeenCalledTimes(1)
    const [url] = (globalThis as any).fetch.mock.calls[0]
    expect(String(url)).toContain('/vermieter/login')

    expect(localStorage.getItem('authToken')).toBe('ok')
    expect(localStorage.getItem('role')).toBe('vermieter')
    expect(localStorage.getItem('vermieterId')).toBe('77')
    expect(localStorage.getItem('userId')).toBe(null)

    expect(pushMock).toHaveBeenCalledWith('/vermieter/dashboard')
  })

  it('Fehlerfall: zeigt Fehlermeldung an, wenn Login HTTP nicht ok ist', async () => {
    roleParam = 'kunde'
    ;(globalThis as any).fetch = mockFetchFail(401)

    const wrapper = mount(LoginView)

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('kunde@test.de')
    await inputs[1].setValue('falsch')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Login fehlgeschlagen')
    expect(pushMock).not.toHaveBeenCalled()
  })
})
