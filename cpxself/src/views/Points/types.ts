export interface Player {
  name: string
  score: number
  isLead: boolean
}

export type RuleKey = 
  | 'foul' 
  | 'give' 
  | 'normal' 
  | 'double_down' 
  | 'small_gold' 
  | 'black' 
  | 'gold9' 
  | 'big_gold'

export interface Rule {
  key: RuleKey
  label: string
  className: string
  shouldReorder?: boolean
}
