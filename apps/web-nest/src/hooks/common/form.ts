import type { FormInstance } from 'ant-design-vue';

import { ref } from 'vue';

export function useFormRules() {
  /** the default required rule */
  const defaultRequiredRule = createRequiredRule('不能为空');

  function createRequiredRule(message: string) {
    return {
      required: true,
      message,
    };
  }

  return {
    defaultRequiredRule,
    createRequiredRule,
  };
}

export function useAntdForm() {
  const formRef = ref<FormInstance | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  function resetFields() {
    formRef.value?.resetFields();
  }

  return {
    formRef,
    validate,
    resetFields,
  };
}
