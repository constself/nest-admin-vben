import { ref } from 'vue';

/**
 * 使用布尔值状态钩子
 *
 * @param initValue 初始值，默认为 false
 * @returns 包含 bool, setBool, setTrue, setFalse, toggle 方法的对象
 * - bool: 响应式布尔值状态
 * - setBool: 设置布尔值状态的方法，接受一个布尔值参数
 * - setTrue: 将布尔值状态设置为 true 的方法
 * - setFalse: 将布尔值状态设置为 false 的方法
 * - toggle: 切换布尔值状态的方法
 */
export function useBoolean(initValue = false) {
  const bool = ref(initValue);

  function setBool(value: boolean) {
    bool.value = value;
  }
  function setTrue() {
    setBool(true);
  }
  function setFalse() {
    setBool(false);
  }
  function toggle() {
    setBool(!bool.value);
  }

  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle,
  };
}
