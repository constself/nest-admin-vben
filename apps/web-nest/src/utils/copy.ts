import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';

const { copy } = useClipboard({ legacy: true });
/**
 * 处理复制操作
 *
 * @param text 要复制的内容
 * @returns 异步操作结果
 */
export async function handleCopy(text: any) {
  await copy(text);

  message.success('复制成功');
}
