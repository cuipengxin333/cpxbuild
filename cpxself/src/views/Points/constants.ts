import type { Rule } from './types'

export const RULES: Rule[] = [
  { key: 'foul', label: '犯规', className: 'foul' },
  { key: 'give', label: '让球', className: 'give' },
  { key: 'normal', label: '普胜', className: 'normal', shouldReorder: true },
  { key: 'double_down', label: '双下', className: 'double-down', shouldReorder: true },
  { key: 'small_gold', label: '小金', className: 'small-gold', shouldReorder: true },
  { key: 'black', label: '黑金九', className: 'black-nine' },
  { key: 'gold9', label: '黄金九', className: 'gold-nine' },
  { key: 'big_gold', label: '大金', className: 'big-gold' }
]

export const TIPS = "目前只支持3人娱乐积分"
