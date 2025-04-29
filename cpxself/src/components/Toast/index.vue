<template>
  <div class="toast" :class="type" v-show="visible">
    {{ message }}
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "info", // 'success' | 'error' | 'info'
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const visible = ref(false);

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, props.duration);
});
</script>
  
  <style scoped>
.toast {
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  animation: fadeInOut 3s;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.toast.info {
  background-color: #5dade2;  
}
.toast.success {
  background-color: #58d68d;  
}
.toast.warning {
  background-color: #d5b536;   
}
.toast.error {
  background-color: #ec7063;   
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
  