// 改名为 uno.config.cjs
const { presetUni } = require('@uni-helper/unocss-preset-uni')
const {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup
} = require('unocss')

module.exports = defineConfig({
  presets: [
    presetUni({
      attributify: {
        // 自定义前缀
        // prefix: 'u-',
        // 只匹配以前缀开头的属性
        prefixedOnly: true
      }
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    // 是否只识别 class，不识别属性
    presetAttributify()
  ],
  transformers: [
    // 启用指令功能：主要用于支持 @apply、@screen 和 theme() 等 CSS 指令
    transformerDirectives(),
    // 支持 CSS class 组合，例如: <div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>
    transformerVariantGroup()
  ],
  shortcuts: [],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
      }
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }]
  ],
  theme: {
    colors: {
      primary: 'var(--wot-color-theme,#0957DE)'
    }
  }
})
