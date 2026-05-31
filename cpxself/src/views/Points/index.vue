<template>
  <div class="points-page">
    <div class="points-card">
      <header class="page-header">
        <h1 class="page-title">娱乐积分板</h1>
        <p class="page-subtitle">三人娱乐计分，实时记录每一局</p>
      </header>

      <!-- 准备阶段：输入姓名 -->
      <div v-if="!isGameStarted" class="setup-section">
        <div class="tip-banner">
          <span class="tip-icon">ℹ️</span>
          <span>{{ TIPS }}</span>
        </div>
        <div class="input-group">
          <div v-for="(_, index) in tempNames" :key="index" class="input-item">
            <span class="player-badge">{{ index + 1 }}</span>
            <input
              v-model="tempNames[index]"
              :placeholder="`请输入玩家 ${index + 1} 姓名`"
              type="text"
              @keyup.enter="startGame"
            />
          </div>
        </div>
        <button
          class="start-btn"
          :disabled="!isReadyToStart"
          @click="startGame"
        >
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
          <button class="action-btn reset-btn" @click="confirmAction('reset')">
            重新开始
          </button>
          <button class="action-btn clear-btn" @click="confirmAction('clear')">
            清空分数
          </button>
        </div>
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
import { ref, computed, reactive } from "vue";
import type { Player, RuleKey } from "./types";
import { TIPS } from "./constants";
import PlayerCard from "./PlayerCard.vue";
import CustomModal from "./CustomModal.vue";

const isGameStarted = ref(false);
const tempNames = ref(["", "", ""]);
const players = ref<Player[]>([
  { name: "", score: 0, isLead: false },
  { name: "", score: 0, isLead: false },
  { name: "", score: 0, isLead: false },
]);

// 弹窗状态
const modal = reactive({
  show: false,
  message: "",
  onConfirm: () => {},
});

const showConfirm = (message: string, onConfirm: () => void) => {
  modal.message = message;
  modal.onConfirm = onConfirm;
  modal.show = true;
};

const closeModal = () => {
  modal.show = false;
};

const handleModalConfirm = () => {
  modal.onConfirm();
  closeModal();
};

const isReadyToStart = computed(() => {
  return tempNames.value.every((name) => name.trim() !== "");
});

const startGame = () => {
  if (!isReadyToStart.value) return;

  players.value = tempNames.value.map((name, index) => ({
    name: name.trim(),
    score: 0,
    isLead: index === 0,
  }));
  isGameStarted.value = true;
};

const applyRule = (index: number, rule: string) => {
  const selfIdx = index;
  const nextIdx = (index + 1) % 3;
  const prevIdx = (index + 2) % 3;

  const self = players.value[selfIdx];
  const next = players.value[nextIdx];
  const prev = players.value[prevIdx];

  let confirmMsg = "";
  let action = () => {};
  let shouldReorder = false;
  let newLeadIdx = -1;

  switch (rule as RuleKey) {
    case "foul":
      confirmMsg = `是否给 ${self.name} -1分，给 ${prev.name} +1分？`;
      action = () => {
        players.value[selfIdx].score -= 1;
        players.value[prevIdx].score += 1;
      };
      break;
    case "give":
      confirmMsg = `是否给 ${self.name} +1分，给 ${prev.name} -1分？`;
      action = () => {
        players.value[selfIdx].score += 1;
        players.value[prevIdx].score -= 1;
      };
      break;
    case "normal":
      confirmMsg = `是否给 ${self.name} +4分，给 ${prev.name} -4分？(触发换位)`;
      action = () => {
        players.value[selfIdx].score += 4;
        players.value[prevIdx].score -= 4;
      };
      shouldReorder = true;
      newLeadIdx = selfIdx;
      break;
    case "double_down":
      confirmMsg = `是否给 ${self.name} -4分，给 ${prev.name} +4分？(触发换位)`;
      action = () => {
        players.value[selfIdx].score -= 4;
        players.value[prevIdx].score += 4;
      };
      shouldReorder = true;
      newLeadIdx = selfIdx;
      break;
    case "small_gold":
      confirmMsg = `是否给 ${self.name} +7分，给 ${prev.name} -7分？(触发换位)`;
      action = () => {
        players.value[selfIdx].score += 7;
        players.value[prevIdx].score -= 7;
      };
      shouldReorder = true;
      newLeadIdx = selfIdx;
      break;
    case "black":
      confirmMsg = `是否给 ${self.name} -8分，${next.name} +4分，${prev.name} +4分？`;
      action = () => {
        players.value[selfIdx].score -= 8;
        players.value[nextIdx].score += 4;
        players.value[prevIdx].score += 4;
      };
      newLeadIdx = selfIdx;
      break;
    case "gold9":
      confirmMsg = `是否给 ${self.name} +8分，${next.name} -4分，${prev.name} -4分？`;
      action = () => {
        players.value[selfIdx].score += 8;
        players.value[nextIdx].score -= 4;
        players.value[prevIdx].score -= 4;
      };
      newLeadIdx = selfIdx;
      break;
    case "big_gold":
      confirmMsg = `是否给 ${self.name} +20分，${next.name} -10分，${prev.name} -10分？`;
      action = () => {
        players.value[selfIdx].score += 20;
        players.value[nextIdx].score -= 10;
        players.value[prevIdx].score -= 10;
      };
      newLeadIdx = selfIdx;
      break;
  }

  if (confirmMsg) {
    showConfirm(confirmMsg, () => {
      action();
      if (newLeadIdx !== -1) {
        players.value.forEach((p, i) => {
          p.isLead = i === newLeadIdx;
        });
      }
      if (shouldReorder) {
        const winner = players.value[selfIdx];
        const upper = players.value[(selfIdx + 2) % 3];
        const lower = players.value[(selfIdx + 1) % 3];
        players.value = [winner, upper, lower];
        players.value.forEach((p, i) => (p.isLead = i === 0));
      }
    });
  }
};

const confirmAction = (type: "reset" | "clear") => {
  const msg =
    type === "reset"
      ? "确定要重新开始吗？这将清除所有姓名和分数。"
      : "确定要清空所有分数吗？";
  showConfirm(msg, () => {
    if (type === "reset") {
      isGameStarted.value = false;
      tempNames.value = ["", "", ""];
      players.value = [
        { name: "", score: 0, isLead: false },
        { name: "", score: 0, isLead: false },
        { name: "", score: 0, isLead: false },
      ];
    } else {
      players.value.forEach((p) => (p.score = 0));
    }
  });
};
</script>

<style scoped lang="scss">
.points-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.points-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2rem 1.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.page-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.tip-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--text-secondary);
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  border: 1px solid rgba(var(--primary-color-rgb), 0.15);

  .tip-icon {
    flex-shrink: 0;
    font-size: 1rem;
  }
}

.setup-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  width: 100%;
  max-width: 360px;
  margin-bottom: 1.75rem;
}

.input-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.player-badge {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);
}

.input-item input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.12);
  }
}

.start-btn {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  color: white;
  border: none;
  padding: 0.75rem 2.5rem;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 16px rgba(var(--primary-color-rgb), 0.35);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--primary-color-rgb), 0.45);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: var(--tag-bg);
    color: var(--tag-text);
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.7;
  }
}

.game-section {
  display: flex;
  flex-direction: column;
}

.player-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-footer {
  display: flex;
  justify-content: center;
  gap: 0.875rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  border: 1px solid var(--border-color);
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  background: var(--bg-primary);
  color: var(--text-secondary);

  &:hover {
    transform: translateY(-1px);
    border-color: var(--primary-color);
    color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.12);
  }

  &:active {
    transform: translateY(0);
  }
}

.reset-btn:hover {
  background: rgba(var(--primary-color-rgb), 0.08);
}

.clear-btn:hover {
  background: rgba(var(--accent-color-rgb), 0.08);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

@media (max-width: 480px) {
  .points-card {
    padding: 1.5rem 1.25rem;
    border-radius: 1.25rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .action-footer {
    flex-direction: column;

    .action-btn {
      width: 100%;
    }
  }
}
</style>
