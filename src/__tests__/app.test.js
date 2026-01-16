import { mount } from '@vue/test-utils'
import App from '../App.vue'

test('App rendert ohne Fehler', () => {
  const wrapper = mount(App)
  expect(wrapper.exists()).toBe(true)
})
