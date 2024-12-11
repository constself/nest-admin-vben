import { useBoolean } from './use-boolean';

/**
 * 自定义Hook，用于控制Loading
 *
 * @param initValue 初始加载状态，默认为false
 * @returns 返回一个对象，包含以下属性：
 * - loading: 当前加载状态，类型为布尔值
 * - startLoading: 启动加载状态的函数，无参数
 * - endLoading: 结束加载状态的函数，无参数
 */
export function useLoading(initValue = false) {
  const {
    bool: loading,
    setTrue: startLoading,
    setFalse: endLoading,
  } = useBoolean(initValue);

  return {
    loading,
    startLoading,
    endLoading,
  };
}
