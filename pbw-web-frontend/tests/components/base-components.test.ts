import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTabs from '@/components/base/BaseTabs.vue'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import StatItem from '@/components/shared/StatItem.vue'

describe('base components', () => {
  it('renders a button variant and emits click when enabled', async () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'outline' },
      slots: { default: '继续' },
    })

    await wrapper.trigger('click')

    expect(wrapper.text()).toBe('继续')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['border', 'border-gray-300', 'bg-transparent', 'text-gray-950']),
    )
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('maps button variants to the planned Tailwind classes', () => {
    const variants = {
      primary: ['bg-[#030213]', 'text-white'],
      secondary: ['bg-gray-100', 'text-gray-900'],
      outline: ['border', 'border-gray-300', 'bg-transparent', 'text-gray-950'],
      ghost: ['bg-transparent', 'text-gray-700'],
    }

    for (const variant of ['primary', 'secondary', 'outline', 'ghost'] as const) {
      const classes = variants[variant]
      expect(mount(BaseButton, { props: { variant } }).classes()).toEqual(
        expect.arrayContaining(classes),
      )
    }
  })

  it.each(['sm', 'md', 'lg'] as const)('renders the %s button size class', (size) => {
    const wrapper = mount(BaseButton, { props: { size } })
    const sizeClasses = {
      sm: ['h-8', 'px-3', 'text-sm'],
      md: ['h-10', 'px-4', 'text-sm'],
      lg: ['h-11', 'px-6', 'text-base'],
    }

    expect(wrapper.classes()).toEqual(expect.arrayContaining(sizeClasses[size]))
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: '不可用' },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('opens in Teleport, closes by request, and closes on Escape', async () => {
    const wrapper = mount(BaseDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: '确认操作' },
      slots: { default: '<p>弹窗内容</p>' },
    })

    expect(document.body.textContent).toContain('弹窗内容')
    expect(document.body.querySelector('[data-testid="base-dialog"]')?.className).toContain('fixed')
    expect(document.body.querySelector('[aria-label="关闭弹窗"]')?.className).toContain('absolute')
    expect(document.body.querySelector('[class*="max-w-lg"]')?.className).toEqual(
      expect.stringContaining('max-w-lg'),
    )

    await document.body.querySelector<HTMLElement>('[data-testid="dialog-close"]')?.click()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
  })

  it('forwards input attrs to the native input instead of the wrapper', () => {
    const wrapper = mount(BaseInput, {
      attrs: { name: 'account', disabled: true, 'aria-describedby': 'account-help' },
      props: { id: 'account', modelValue: '', label: '账号' },
    })

    expect(wrapper.find('input').attributes()).toMatchObject({
      name: 'account',
      disabled: '',
      'aria-describedby': 'account-help',
    })
    expect(wrapper.attributes('name')).toBeUndefined()
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
  })

  it('forwards dialog attrs to the role dialog container', () => {
    const wrapper = mount(BaseDialog, {
      attachTo: document.body,
      attrs: { 'aria-labelledby': 'dialog-title', 'data-context': 'account' },
      props: { modelValue: true, title: '确认操作' },
    })

    const dialog = document.body.querySelector('[data-testid="base-dialog"]')
    expect(dialog?.getAttribute('role')).toBe('dialog')
    expect(dialog?.getAttribute('aria-labelledby')).toMatch(/^base-dialog-title-/)
    expect(dialog?.getAttribute('data-context')).toBe('account')
    wrapper.unmount()
  })

  it('provides an accessible title relationship by default', () => {
    const wrapper = mount(BaseDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: '确认操作' },
    })

    const dialog = document.body.querySelector('[data-testid="base-dialog"]')
    expect(dialog?.getAttribute('aria-labelledby')).toMatch(/^base-dialog-title-/)
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.getAttribute('title')).toBe('确认操作')
    const titleId = dialog?.getAttribute('aria-labelledby')
    expect(document.getElementById(titleId ?? '')?.textContent).toBe('确认操作')
    wrapper.unmount()
  })

  it('keeps the accessible title relationship when a custom header is provided', () => {
    const wrapper = mount(BaseDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: '确认操作' },
      slots: { header: '<div data-testid="custom-dialog-header">自定义标题</div>' },
    })

    const dialog = document.body.querySelector('[data-testid="base-dialog"]')
    const titleId = dialog?.getAttribute('aria-labelledby')
    expect(titleId).toMatch(/^base-dialog-title-/)
    expect(document.getElementById(titleId ?? '')).not.toBeNull()
    expect(document.body.querySelector('[data-testid="custom-dialog-header"]')?.textContent).toBe(
      '自定义标题',
    )
    wrapper.unmount()
  })

  it('allows a trailing slot button to receive clicks', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(BaseInput, {
      props: { id: 'search', modelValue: '', label: '搜索' },
      slots: {
        trailing: () => h('button', { type: 'button', onClick: handleClick }, '清除'),
      },
    })

    await wrapper.find('[data-testid="input-trailing"] button').trigger('click')

    expect(handleClick).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-testid="input-trailing"]').classes()).not.toContain(
      'pointer-events-none',
    )
  })

  it('uses a unique title id and focuses then restores dialog focus', async () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()

    const wrapper = mount(BaseDialog, {
      attachTo: document.body,
      props: { modelValue: false, title: '确认操作' },
    })

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    const dialog = document.body.querySelector('[data-testid="base-dialog"]')
    const titleId = dialog?.getAttribute('aria-labelledby')
    expect(titleId).toMatch(/^base-dialog-title-/)
    expect(document.getElementById(titleId ?? '')?.textContent).toBe('确认操作')
    expect(document.activeElement).toBe(document.body.querySelector('[data-testid="dialog-close"]'))

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(document.activeElement).toBe(trigger)

    wrapper.unmount()
    trigger.remove()
  })

  it('closes only the current dialog instance on Escape', async () => {
    const first = mount(BaseDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: '第一个' },
    })
    const second = mount(BaseDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: '第二个' },
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(first.emitted('update:modelValue')).toBeUndefined()
    expect(second.emitted('update:modelValue')).toEqual([[false]])

    first.unmount()
    second.unmount()
  })

  it('emits the selected tab value', async () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'login',
        tabs: [
          { label: '登录', value: 'login' },
          { label: '注册', value: 'register' },
        ],
      },
    })

    expect(wrapper.find('[role="tablist"]').classes()).toEqual(
      expect.arrayContaining(['grid', 'bg-gray-200/70', 'p-1']),
    )
    expect(wrapper.find('[data-tab="login"]').classes()).toEqual(
      expect.arrayContaining(['bg-white', 'text-gray-950', 'shadow-sm']),
    )
    expect(wrapper.find('[data-tab="register"]').classes()).toContain('text-gray-700')

    await wrapper.find('[data-tab="register"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['register']])
  })

  it('passes the current tab to the default slot as active', () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'login',
        tabs: [{ label: '登录', value: 'login' }],
      },
      slots: { default: '<span data-testid="active-tab">{{ active }}</span>' },
    })

    expect(wrapper.find('[data-testid="active-tab"]').text()).toBe('login')
  })

  it('uses roving tabindex and supports arrow, Home, and End navigation', async () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'register',
        tabs: [
          { label: '登录', value: 'login' },
          { label: '注册', value: 'register' },
          { label: '游客', value: 'guest' },
        ],
      },
    })

    expect(wrapper.find('[data-tab="login"]').attributes('tabindex')).toBe('-1')
    expect(wrapper.find('[data-tab="register"]').attributes('tabindex')).toBe('0')
    expect(wrapper.find('[data-tab="guest"]').attributes('tabindex')).toBe('-1')

    await wrapper.find('[data-tab="register"]').trigger('keydown', { key: 'ArrowLeft' })
    await wrapper.find('[data-tab="register"]').trigger('keydown', { key: 'ArrowRight' })
    await wrapper.find('[data-tab="register"]').trigger('keydown', { key: 'Home' })
    await wrapper.find('[data-tab="register"]').trigger('keydown', { key: 'End' })

    expect(wrapper.emitted('update:modelValue')).toEqual([
      ['login'],
      ['guest'],
      ['login'],
      ['guest'],
    ])
  })

  it('renders tab buttons in a separate grid from the active slot', () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'login',
        tabs: [{ label: '登录', value: 'login' }],
      },
      slots: { default: '<span data-testid="active-tab">{{ active }}</span>' },
    })

    expect(wrapper.find('[role="tablist"]').classes()).toEqual(
      expect.arrayContaining(['grid', 'bg-gray-200/70', 'p-1']),
    )
    expect(wrapper.find('[role="tablist"] [data-tab="login"]').exists()).toBe(true)
    expect(wrapper.find('[role="tablist"] [data-testid="active-tab"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="active-tab"]').element.parentElement).toBe(
      wrapper.element,
    )
  })

  it('uses one equal-width grid column for each tab', () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'login',
        tabs: [
          { label: '登录', value: 'login' },
          { label: '注册', value: 'register' },
          { label: '游客', value: 'guest' },
        ],
      },
    })

    expect(wrapper.find('[role="tablist"]').attributes('style')).toContain(
      'grid-template-columns: repeat(3, minmax(0, 1fr))',
    )
  })

  it('supports v-model style input updates', async () => {
    const wrapper = mount(BaseInput, {
      props: { id: 'account', modelValue: '旧值', label: '账号', autocomplete: 'username' },
    })
    const input = wrapper.find('input')

    expect(wrapper.find('label').attributes('for')).toBe('account')
    expect(input.attributes('id')).toBe('account')
    expect(input.attributes('autocomplete')).toBe('username')
    await input.setValue('新值')

    expect(wrapper.emitted('update:modelValue')).toEqual([['新值']])
  })

  it('renders leading and trailing slots with matching input padding classes', () => {
    const wrapper = mount(BaseInput, {
      props: { id: 'search', modelValue: '', label: '搜索' },
      slots: { leading: '🔍', trailing: '清除' },
    })

    expect(wrapper.find('[data-testid="input-leading"]').text()).toBe('🔍')
    expect(wrapper.find('[data-testid="input-leading"]').classes()).toEqual(
      expect.arrayContaining(['absolute']),
    )
    expect(wrapper.find('[data-testid="input-trailing"]').text()).toBe('清除')
    expect(wrapper.find('[data-testid="input-trailing"]').classes()).toEqual(
      expect.arrayContaining(['absolute']),
    )
    expect(wrapper.find('div.relative').classes()).toContain('relative')
    expect(wrapper.find('input').classes()).toEqual(expect.arrayContaining(['pl-10', 'pr-10']))
  })

  it('renders a fallback when the image fails to load', async () => {
    const wrapper = mount(ResponsiveImage, {
      props: { src: '/missing.png', alt: '头像', class: 'h-20 w-20' },
    })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('[data-testid="image-fallback"]').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('[data-testid="image-fallback"]').classes()).toEqual(
      expect.arrayContaining(['h-20', 'w-20', 'flex', 'items-center', 'justify-center', 'bg-gray-200', 'text-center', 'text-xs', 'text-gray-500']),
    )
    expect(wrapper.find('[data-testid="image-fallback"]').attributes('aria-label')).toBe('头像加载失败')
  })

  it('renders a fallback for an empty image source and resets after source changes', async () => {
    const wrapper = mount(ResponsiveImage, { props: { src: null, alt: '封面', class: 'rounded-lg' } })

    expect(wrapper.find('[data-testid="image-fallback"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="image-fallback"]').classes()).toContain('rounded-lg')
    expect(wrapper.find('[data-testid="image-fallback"]').attributes('aria-label')).toBe('封面加载失败')

    await wrapper.setProps({ src: '/first.png' })
    expect(wrapper.find('img').exists()).toBe(true)
    await wrapper.find('img').trigger('error')
    await wrapper.setProps({ src: '/second.png' })

    expect(wrapper.find('img').attributes('src')).toBe('/second.png')
    expect(wrapper.find('img').classes()).toContain('rounded-lg')
    expect(wrapper.find('[data-testid="image-fallback"]').exists()).toBe(false)
  })

  it('renders a section heading and stat item', () => {
    const SectionWithStat = defineComponent({
      components: { SectionHeading, StatItem },
      template: `
        <div>
          <SectionHeading title="作品数据" description="持续创作" />
          <StatItem label="播放量" value="1.2M" dark />
        </div>
      `,
    })
    const wrapper = mount(SectionWithStat)

    expect(wrapper.text()).toContain('作品数据')
    expect(wrapper.text()).toContain('持续创作')
    expect(wrapper.text()).toContain('播放量')
    expect(wrapper.text()).toContain('1.2M')
    expect(wrapper.find('header').classes()).toContain('mb-12')
    expect(wrapper.find('h2').classes()).toEqual(
      expect.arrayContaining(['mb-4', 'text-4xl', 'font-bold']),
    )
    expect(wrapper.find('header p').classes()).toContain('text-gray-600')
    const statWrapper = wrapper.findComponent(StatItem)
    expect(statWrapper.classes()).toContain('text-center')
    expect(statWrapper.find('strong').classes()).toEqual(
      expect.arrayContaining(['text-3xl', 'font-bold', 'md:text-4xl']),
    )
    expect(statWrapper.find('span').classes()).toEqual(
      expect.arrayContaining(['mt-1', 'text-sm']),
    )
    expect(statWrapper.find('strong').classes()).toContain('text-white')
    expect(wrapper.find('span').classes()).toContain('text-gray-400')

    const lightWrapper = mount(StatItem, { props: { label: '点赞数', value: 100 } })
    expect(lightWrapper.find('span').classes()).toContain('text-gray-600')
  })

  it('responds to a dialog model value change', async () => {
    const wrapper = mount(BaseDialog, { props: { modelValue: false, title: '详情' } })

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    expect(document.body.querySelector('[data-testid="base-dialog"]')).not.toBeNull()
    wrapper.unmount()
  })
})
