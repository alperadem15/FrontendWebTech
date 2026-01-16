import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AccountSelectView from '@/views/AccountSelectView.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

describe('AccountSelectView (Use-Case)', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it('Buttons navigieren zu den richtigen Routes', async () => {
    const wrapper = mount(AccountSelectView)
    const buttons = wrapper.findAll('button')

    // Reihenfolge laut Template:
    // 0: Register Kunde
    // 1: Login Kunde
    // 2: Register Vermieter
    // 3: Login Vermieter
    await buttons[0].trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/register/kunde')

    await buttons[1].trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/login/kunde')

    await buttons[2].trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/register/vermieter')

    await buttons[3].trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/login/vermieter')
  })
})
