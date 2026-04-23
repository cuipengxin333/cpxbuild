<template>
  <div class="points-container">
    <h1>娱乐积分板</h1>

    <!-- 准备阶段：输入姓名 -->
    <div v-if="!isGameStarted" class="setup-section">
      <div class="tip-banner">{{ tips }}</div>
      <div class="input-group">
        <div v-for="(name, index) in tempNames" :key="index" class="input-item">
          <label>玩家 {{ index + 1 }} 姓名：</label>
          <input v-model="tempNames[index]" type="text" :placeholder="'请输入玩家' + '姓名'" @keyup.enter="startGame" />
        </div>
      </div>
      <button class="start-btn" :disabled="!isReadyToStart" @click="startGame">
        开始游戏
      </button>
    </div>

    <!-- 游戏阶段：计分 -->
    <div v-else class="game-section">
      <div class="player-cards">
        <div v-for="(player, index) in players" :key="index" class="player-card">
          <div class="player-info">
            <div class="player-name">
              {{ player.name }}
              <span v-if="player.isLead" class="lead-tag">头家</span>
            </div>
            <div class="player-score" :class="{ 'positive': player.score > 0, 'negative': player.score < 0 }">
              {{ player.score }}
            </div>
          </div>
          <div class="score-controls">
            <div class="control-grid">
              <button class="rule-btn foul" @click="applyRule(index, 'foul')">犯规</button>
              <button class="rule-btn give" @click="applyRule(index, 'give')">让球</button>
              <button class="rule-btn normal" @click="applyRule(index, 'normal')">普胜</button>
              <button class="rule-btn double-down" @click="applyRule(index, 'double_down')">双下</button>
              <button class="rule-btn small-gold" @click="applyRule(index, 'small_gold')">小金</button>
              <button class="rule-btn black-nine" @click="applyRule(index, 'black')">黑金九</button>
              <button class="rule-btn gold-nine" @click="applyRule(index, 'gold9')">黄金九</button>
              <button class="rule-btn big-gold" @click="applyRule(index, 'big_gold')">大金</button>
            </div>
          </div>
        </div>
      </div>

      <div class="action-footer">
        <button class="reset-btn" @click="confirmAction('reset')">重新开始</button>
        <button class="clear-btn" @click="confirmAction('clear')">清空分数</button>
      </div>
    </div>

    <!-- 自定义确认弹窗 -->
    <div v-if="modal.show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">操作确认</div>
        <div class="modal-body">{{ modal.message }}</div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="closeModal">取消</button>
          <button class="modal-btn confirm" @click="handleModalConfirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const tips = ref("目前只支持3人娱乐积分")
const isGameStarted = ref(false)
const tempNames = ref(['', '', ''])
const players = ref([
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
    isLead: index === 0 // 初始默认第一个人为头家
  }))
  isGameStarted.value = true
}

const applyRule = (index: number, rule: string) => {
  const selfIdx = index
  const nextIdx = (index + 1) % 3 // 下家
  const prevIdx = (index + 2) % 3 // 上家

  const self = players.value[selfIdx]
  const next = players.value[nextIdx]
  const prev = players.value[prevIdx]

  let confirmMsg = ''
  let action = () => { }
  let shouldReorder = false
  let newLeadIdx = -1

  switch (rule) {
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
    case 'normal': // 普胜
      confirmMsg = `是否给 ${self.name} +4分，给 ${prev.name} -4分？(触发换位)`
      action = () => {
        players.value[selfIdx].score += 4
        players.value[prevIdx].score -= 4
      }
      shouldReorder = true
      newLeadIdx = selfIdx
      break
    case 'double_down': // 双下
      confirmMsg = `是否给 ${self.name} -4分，给 ${prev.name} +4分？(触发换位)`
      action = () => {
        players.value[selfIdx].score -= 4
        players.value[prevIdx].score += 4
      }
      shouldReorder = true
      newLeadIdx = selfIdx
      break
    case 'small_gold': // 小金
      confirmMsg = `是否给 ${self.name} +7分，给 ${prev.name} -7分？(触发换位)`
      action = () => {
        players.value[selfIdx].score += 7
        players.value[prevIdx].score -= 7
      }
      shouldReorder = true
      newLeadIdx = selfIdx
      break
    case 'black': // 黑金九
      confirmMsg = `是否给 ${self.name} -8分，${next.name} +4分，${prev.name} +4分？`
      action = () => {
        players.value[selfIdx].score -= 8
        players.value[nextIdx].score += 4
        players.value[prevIdx].score += 4
      }
      newLeadIdx = selfIdx
      break
    case 'gold9': // 黄金九
      confirmMsg = `是否给 ${self.name} +8分，${next.name} -4分，${prev.name} -4分？`
      action = () => {
        players.value[selfIdx].score += 8
        players.value[nextIdx].score -= 4
        players.value[prevIdx].score -= 4
      }
      newLeadIdx = selfIdx
      break
    case 'big_gold': // 大金
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

      // 处理头家标识
      if (newLeadIdx !== -1) {
        players.value.forEach((p, i) => {
          p.isLead = i === newLeadIdx
        })
      }

      // 处理排序：普胜、双下、小金
      if (shouldReorder) {
        const winner = players.value[selfIdx]
        const upper = players.value[(selfIdx + 2) % 3]
        const lower = players.value[(selfIdx + 1) % 3]
        players.value = [winner, upper, lower]
        // 排序后，winner 永远在 index 0
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

.player-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 5px;
}

.player-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lead-tag {
  background-color: #e67e22;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: normal;
}

.player-score {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
}

.player-score.positive {
  color: #e74c3c;
}

.player-score.negative {
  color: #2ecc71;
}

.score-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.rule-btn {
  padding: 8px 4px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  color: white;
}

.rule-btn:hover {
  opacity: 0.8;
}

.foul {
  background-color: #94a3b8;
}

.give {
  background-color: #38bdf8;
}

.normal {
  background-color: #4ade80;
}

.double-down {
  background-color: #2c3a52;
}

.small-gold {
  background-color: #fbbf24;
  color: #92400e;
}

.black-nine {
  background-color: #1e293b;
}

.gold-nine {
  background-color: #f59e0b;
  color: #fff;
}

.big-gold {
  background-color: #facc15;
  color: #854d0e;
  font-weight: 800;
}

.manual-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.manual-controls button {
  padding: 4px 15px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
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

  .player-card {
    width: 100%;
  }
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 320px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  color: #2c3e50;
}

.modal-body {
  padding: 20px;
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  border-top: 1px solid #eee;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  font-size: 1rem;
  cursor: pointer;
}

.modal-btn.cancel {
  color: #666;
  border-right: 1px solid #eee;
}

.modal-btn.confirm {
  color: #42b983;
  font-weight: bold;
}

.modal-btn:active {
  background-color: #f9f9f9;
}
</style>
