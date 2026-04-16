import { reactive } from 'vue';

export const testStore = reactive({
  result: null as any,
  setResult(data: any) {
    // 根据接口返回结构，数据嵌套在 result 字段中
    this.result = data.result || data;
  },
  clearResult() {
    this.result = null;
  }
});
