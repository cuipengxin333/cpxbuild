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

<style scoped>
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
  text-align: center;
}

.modal-body {
  padding: 20px;
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
  text-align: center;
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
