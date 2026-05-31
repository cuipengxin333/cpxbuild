<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">操作确认</div>
      <div class="modal-body">{{ message }}</div>
      <div class="modal-footer">
        <button class="modal-btn cancel" @click="$emit('close')">取消</button>
        <button class="modal-btn confirm" @click="$emit('confirm')">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  message: string
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1.25rem;
}

.modal-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  width: 90%;
  max-width: 340px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modal-in {
  from {
    transform: translateY(16px) scale(0.97);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-header {
  padding: 1rem 1.25rem;
  font-weight: 700;
  border-bottom: 1px solid var(--border-color);
  font-size: 1.05rem;
  color: var(--text-primary);
  text-align: center;
}

.modal-body {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  text-align: center;
}

.modal-footer {
  display: flex;
  border-top: 1px solid var(--border-color);
}

.modal-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  background: none;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
}

.modal-btn.cancel {
  color: var(--text-secondary);
  border-right: 1px solid var(--border-color);

  &:hover {
    background: rgba(var(--primary-color-rgb), 0.05);
  }
}

.modal-btn.confirm {
  color: var(--primary-color);
  font-weight: 700;

  &:hover {
    background: rgba(var(--primary-color-rgb), 0.08);
  }
}
</style>
