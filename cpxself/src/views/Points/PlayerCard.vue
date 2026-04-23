<template>
  <div class="player-card">
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
        <button 
          v-for="rule in RULES" 
          :key="rule.key"
          :class="['rule-btn', rule.className]"
          @click="$emit('apply-rule', rule.key)"
        >
          {{ rule.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from './types'
import { RULES } from './constants'

defineProps<{
  player: Player
}>()

defineEmits<{
  (e: 'apply-rule', ruleKey: string): void
}>()
</script>

<style scoped>
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
  font-family: 'DIN Alternate', 'Courier New', Courier, monospace;
}

.player-score.positive { color: #e74c3c; }
.player-score.negative { color: #2ecc71; }

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

.foul { background-color: #94a3b8; }
.give { background-color: #38bdf8; }
.normal { background-color: #4ade80; }
.double-down { background-color: #166534; }
.small-gold { background-color: #fbbf24; color: #92400e; }
.black-nine { background-color: #1e293b; }
.gold-nine { background-color: #f59e0b; color: #fff; }
.big-gold { background-color: #facc15; color: #854d0e; font-weight: 800; }
</style>
