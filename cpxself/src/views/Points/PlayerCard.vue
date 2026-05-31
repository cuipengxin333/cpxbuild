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

<style scoped lang="scss">
.player-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.125rem 1.25rem;
  transition: var(--transition);

  &:has(.lead-tag) {
    border-color: rgba(var(--primary-color-rgb), 0.35);
    box-shadow: 0 4px 16px rgba(var(--primary-color-rgb), 0.1);
  }
}

.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border-color);
}

.player-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lead-tag {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 6px rgba(var(--primary-color-rgb), 0.3);
}

.player-score {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  font-family: 'DIN Alternate', 'Courier New', Courier, monospace;
  line-height: 1;
  min-width: 3rem;
  text-align: right;
}

.player-score.positive { color: #ef4444; }
.player-score.negative { color: #22c55e; }

.score-controls {
  display: flex;
  flex-direction: column;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.rule-btn {
  padding: 0.625rem 0.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  color: white;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.08);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.95);
  }
}

.foul { background-color: #94a3b8; }
.give { background-color: #38bdf8; }
.normal { background-color: #4ade80; }
.double-down { background-color: #166534; }
.small-gold { background-color: #fbbf24; color: #92400e; }
.black-nine { background-color: #1e293b; }
.gold-nine { background-color: #f59e0b; color: #fff; }
.big-gold { background-color: #facc15; color: #854d0e; font-weight: 800; }

@media (max-width: 360px) {
  .control-grid {
    grid-template-columns: 1fr;
  }
}
</style>
