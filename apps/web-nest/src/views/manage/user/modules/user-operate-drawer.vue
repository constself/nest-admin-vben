<script setup lang="ts">
import type { AntDesign } from '@vben/types';
import type { Rule } from 'ant-design-vue/es/form';

import { computed, nextTick, reactive, watch } from 'vue';

import { useLoading } from '@vben/hooks';
import { uniqueEmptyValues } from '@vben/utils';
import { useIsMobile } from '@vben-core/composables';

import {
  Button,
  Drawer,
  Form,
  FormItem,
  Input,
  message,
  Space,
} from 'ant-design-vue';

import { userUpdateApi } from '#/api';
import { useAntdForm } from '#/hooks/common/form';

defineOptions({
  name: 'UserOperateDrawer',
});

// Props & Emits
const props = defineProps<{
  operateType: AntDesign.TableOperateType;
  rowData?: null;
}>();

const emit = defineEmits<{
  (e: 'submitted'): void;
  (e: 'update:visible', value: boolean): void;
}>();

const { isMobile } = useIsMobile();
const { loading, startLoading, endLoading } = useLoading();

// Types
interface MerchantFormModel {
  id: number;
  nickname: string;
}

// Refs & Reactive State
const visible = defineModel<boolean>('visible', { default: false });
const { formRef, validate, resetFields } = useAntdForm();

// Constants
const DRAWER_WIDTH = isMobile.value ? 360 : 630;
const INITIAL_MODEL: MerchantFormModel = {
  nickname: '',
};
// Computed
const title = computed(() => {
  const titles: Record<AntDesign.TableOperateType, string> = {
    add: '添加',
    edit: '编辑',
  };
  return titles[props.operateType];
});
// Form Model & Rules
const model = reactive<MerchantFormModel>({ ...INITIAL_MODEL });

const rules: Record<string, Rule[]> = {
  nickname: [{ required: true, message: '请输入昵称' }],
};

// Methods
const handleInitModel = async () => {
  Object.assign(model, INITIAL_MODEL);

  if (props.operateType === 'edit' && props.rowData) {
    await nextTick();
    Object.assign(model, props.rowData);
  }
};

const closeDrawer = () => {
  visible.value = false;
  emit('update:visible', false);
};

const handleSubmit = async () => {
  try {
    await validate();
    startLoading();
    const isEdit = props.operateType === 'edit';
    let res;

    if (isEdit) {
      // 编辑模式：只提取需要的字段并去除空值
      const data = uniqueEmptyValues({
        nickname: model.nickname,
      });
      res = await userUpdateApi({ id: model.id }, data);
    } else {
      // 创建模式：使用完整model
    }

    // if (!res) {
    //   throw new Error('操作未成功完成');
    // }

    // 操作成功后的处理

    if (res) {
      closeDrawer();
      message.success(`${isEdit ? '修改' : '创建'}成功`);
    }

    emit('submitted');
  } catch (error) {
    // 错误处理
    message.error(`${props.operateType === 'edit' ? '修改' : '创建'}失败`);
    console.error('提交失败:', error);
  } finally {
    endLoading();
  }
};

// Watchers
watch(visible, (newVal) => {
  if (newVal) {
    handleInitModel();
    resetFields();
  }
});
</script>

<template>
  <Drawer
    v-model:open="visible"
    :mask-closable="false"
    :title="title"
    :width="DRAWER_WIDTH"
    @close="closeDrawer"
  >
    <Form ref="formRef" :model="model" :rules="rules" layout="vertical">
      <FormItem label="昵称" name="nickname">
        <Input
          v-model:value="model.nickname"
          allow-clear
          placeholder="请输入昵称"
        />
      </FormItem>
    </Form>
    <template #footer>
      <Space :size="16">
        <Button @click="closeDrawer">取消</Button>
        <Button :loading="loading" type="primary" @click="handleSubmit">
          确定
        </Button>
      </Space>
    </template>
  </Drawer>
</template>

<style scoped></style>
