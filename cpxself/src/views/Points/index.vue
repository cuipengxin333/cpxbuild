<template>
  <div class="points-container">
    <h1>娱乐积分板</h1>

    <!-- 准备阶段：输入姓名 -->
    <div v-if="!isGameStarted" class="setup-section">
      <div class="tip-banner">{{ TIPS }}</div>
      <div class="input-group">
        <div v-for="(name, index) in tempNames" :key="index" class="input-item">
          <label>玩家姓名：</label>
          <input 
            v-model="tempNames[index]" 
            :placeholder="`请输入玩家姓名${name}`"
            type="text" 
            @keyup.enter="startGame" 
          />
        </div>
      </div>
      <button class="start-btn" :disabled="!isReadyToStart" @click="startGame">
        开始游戏
      </button>
    </div>

    <!-- 游戏阶段：计分 -->
    <div v-else class="game-section">
      <div class="player-cards">
        <PlayerCard 
          v-for="(player, index) in players" 
          :key="index"
          :player="player"
          @apply-rule="(ruleKey) => applyRule(index, ruleKey)"
        />
      </div>

      <div class="action-footer">
        <button class="reset-btn" @click="confirmAction('reset')">重新开始</button>
        <button class="clear-btn" @click="confirmAction('clear')">清空分数</button>
      </div>
    </div>

    <!-- 自定义确认弹窗 -->
    <CustomModal 
      :show="modal.show"
      :message="modal.message"
      @close="closeModal"
      @confirm="handleModalConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { Player, RuleKey } from './types'
import { TIPS } from './constants'
import PlayerCard from './PlayerCard.vue'
import CustomModal from './CustomModal.vue'

const isGameStarted = ref(false)
const tempNames = ref(['', '', ''])
const players = ref<Player[]>([
  { name: '', score: 0, isLead: false },
  { name: '', score: 0, isLead: false },
  { name: '', score: 0, isLead: false }
])

// 弹窗状态
const modal = reactive({
  show: false,
  message: '',
  onConfirm: () => { }
})

const showConfirm = (message: string, onConfirm: () => void) => {
  modal.message = message
  modal.onConfirm = onConfirm
  modal.show = true
}

const closeModal = () => {
  modal.show = false
}

const handleModalConfirm = () => {
  modal.onConfirm()
  closeModal()
}

const isReadyToStart = computed(() => {
  return tempNames.value.every(name => name.trim() !== '')
})

const startGame = () => {
  if (!isReadyToStart.value) return

  players.value = tempNames.value.map((name, index) => ({
    name: name.trim(),
    score: 0,
    isLead: index === 0
  }))
  isGameStarted.value = true
}

const applyRule = (index: number, rule: string) => {
  const selfIdx = index
  const nextIdx = (index + 1) % 3
  const prevIdx = (index + 2) % 3

  const self = players.value[selfIdx]
  const next = players.value[nextIdx]
  const prev = players.value[prevIdx]

  let confirmMsg = ''
  let action = () => { }
  let shouldReorder = false
  let newLeadIdx = -1

  switch (rule as RuleKey) {
    case 'foul':
      confirmMsg = `是否给 ${self.name} -1分，给 ${prev.name} +1分？`
      action = () => {
        players.value[selfIdx].score -= 1
        players.value[prevIdx].score += 1
      }
      break
    case 'give':
      confirmMsg = `是否给 ${self.name} +1分，给 ${prev.name} -1分？`
      action = () => {
        players.value[selfIdx].score += 1
        players.value[prevIdx].score -= 1
      }
      break
    case 'normal':
      confirmMsg = `是否给 ${self.name} +4分，给 ${prev.name} -4分？(触发换位)`
      action = () => {
        players.value[selfIdx].score += 4
        players.value[prevIdx].score -= 4
      }
      shouldReorder = true
      newLeadIdx = selfIdx
      break
    case 'double_down':
      confirmMsg = `是否给 ${self.name} -4分，给 ${prev.name} +4分？(触发换位)`
      action = () => {
        players.value[selfIdx].score -= 4
        players.value[prevIdx].score += 4
      }
      shouldReorder = true
      newLeadIdx = selfIdx
      break
    case 'small_gold':
      confirmMsg = `是否给 ${self.name} +7分，给 ${prev.name} -7分？(触发换位)`
      action = () => {
        players.value[selfIdx].score += 7
        players.value[prevIdx].score -= 7
      }
      shouldReorder = true
      newLeadIdx = selfIdx
      break
    case 'black':
      confirmMsg = `是否给 ${self.name} -8分，${next.name} +4分，${prev.name} +4分？`
      action = () => {
        players.value[selfIdx].score -= 8
        players.value[nextIdx].score += 4
        players.value[prevIdx].score += 4
      }
      newLeadIdx = selfIdx
      break
    case 'gold9':
      confirmMsg = `是否给 ${self.name} +8分，${next.name} -4分，${prev.name} -4分？`
      action = () => {
        players.value[selfIdx].score += 8
        players.value[nextIdx].score -= 4
        players.value[prevIdx].score -= 4
      }
      newLeadIdx = selfIdx
      break
    case 'big_gold':
      confirmMsg = `是否给 ${self.name} +20分，${next.name} -10分，${prev.name} -10分？`
      action = () => {
        players.value[selfIdx].score += 20
        players.value[nextIdx].score -= 10
        players.value[prevIdx].score -= 10
      }
      newLeadIdx = selfIdx
      break
  }

  if (confirmMsg) {
    showConfirm(confirmMsg, () => {
      action()
      if (newLeadIdx !== -1) {
        players.value.forEach((p, i) => {
          p.isLead = i === newLeadIdx
        })
      }
      if (shouldReorder) {
        const winner = players.value[selfIdx]
        const upper = players.value[(selfIdx + 2) % 3]
        const lower = players.value[(selfIdx + 1) % 3]
        players.value = [winner, upper, lower]
        players.value.forEach((p, i) => p.isLead = i === 0)
      }
    })
  }
}

const confirmAction = (type: 'reset' | 'clear') => {
  const msg = type === 'reset' ? '确定要重新开始吗？这将清除所有姓名和分数。' : '确定要清空所有分数吗？'
  showConfirm(msg, () => {
    if (type === 'reset') {
      isGameStarted.value = false
      tempNames.value = ['', '', '']
      players.value = [
        { name: '', score: 0, isLead: false },
        { name: '', score: 0, isLead: false },
        { name: '', score: 0, isLead: false }
      ]
    } else {
      players.value.forEach(p => p.score = 0)
    }
  })
}
</script>

<style scoped lang="scss">
.points-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.tip-banner {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.setup-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.input-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.input-item label {
  width: 100px;
  text-align: right;
  font-weight: bold;
  color: #34495e;
}

.input-item input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  outline: none;
}

.input-item input:focus {
  border-color: #42b983;
}

.start-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 20px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.player-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.action-footer {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.reset-btn,
.clear-btn {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  color: white;
}

.reset-btn {
  background: #2e705c;
}

.clear-btn {
  background: #295b9c;
}

@media (max-width: 600px) {
  .player-cards {
    flex-direction: column;
  }
}
</style>
