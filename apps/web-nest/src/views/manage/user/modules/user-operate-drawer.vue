<script setup lang="ts">
import type { AntDesign } from '@vben/types';
import type { Rule } from 'ant-design-vue/es/form';

import {
  createSystemUsersListApi,
  getSystemRolesApi,
  userUpdateApi,
} from '#/api';
import { enableStatusOptions } from '#/constants';
import { useAntdForm } from '#/hooks/common/form';
import { useLoading } from '@vben/hooks';
import { uniqueEmptyValues } from '@vben/utils';
import { useIsMobile } from '@vben-core/composables';
import {
  Button,
  Drawer,
  Form,
  FormItem,
  Input,
  InputPassword,
  message,
  Radio,
  RadioGroup,
  Select,
  Space,
} from 'ant-design-vue';
import { computed, nextTick, reactive, ref, watch } from 'vue';

defineOptions({
  name: 'UserOperateDrawer',
});

// Props & Emits
const props = defineProps<{
  operateType: AntDesign.TableOperateType;
  rowData?: any;
}>();

const emit = defineEmits<{
  (e: 'submitted'): void;
  (e: 'update:visible', value: boolean): void;
}>();

const { isMobile } = useIsMobile();
const { loading, startLoading, endLoading } = useLoading();
const {
  loading: spinLoading,
  startLoading: startspinLoading,
  endLoading: endspinLoading,
} = useLoading();
// Types
interface MerchantFormModel {
  id: number;
  nickname: string;
  username: string;
  email: string;
  phone: string;
  remark: string;
  password: string;
  roleIds: number[];
  roles: [];
  status: null | number;
}

// Refs & Reactive State
const visible = defineModel<boolean>('visible', { default: false });
const { formRef, validate, resetFields } = useAntdForm();

// Constants
const DRAWER_WIDTH = isMobile.value ? 360 : 630;
const INITIAL_MODEL: MerchantFormModel = {
  id: null as any,
  nickname: '',
  username: '',
  email: '',
  phone: '',
  remark: '',
  password: '',
  roleIds: [],
  roles: [],
  status: null,
};
// Computed
const title = computed(() => {
  const titles: Record<AntDesign.TableOperateType, string> = {
    add: '添加',
    edit: '编辑',
  };
  return titles[props.operateType];
});
const isEdit = computed(() => props.operateType === 'edit');

// Form Model & Rules
const model = reactive<MerchantFormModel>({ ...INITIAL_MODEL });

const rules: Record<string, Rule[]> = {
  nickname: [{ required: true, message: '请输入昵称' }],
  username: [{ required: true, message: '请输入用户名' }],
  status: [{ required: true, message: '请选择状态' }],
  roleIds: [{ required: true, message: '请选择角色' }],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度不能小于6位' },
    { max: 16, message: '密码长度不能大于16位' },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱' },
  ],
};
// Methods

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { items } = await getSystemRolesApi();

  if (items) {
    const options = items.map((item: { id: any; name: any }) => ({
      label: item.name,
      value: item.id,
    }));

    // the mock data does not have the roleCode, so fill it
    // if the real request, remove the following code
    const userRoleOptions = model.roles.map((item: { id: any; name: any }) => ({
      label: item.name,
      value: item.id,
    }));
    model.roleIds = userRoleOptions.map((item) => item.value);
    // end
    roleOptions.value = [...options];
  }
}
const handleInitModel = async () => {
  Object.assign(model, INITIAL_MODEL);
  startspinLoading();

  if (props.operateType === 'edit' && props.rowData) {
    await nextTick();
    props.rowData.status &&
      // eslint-disable-next-line vue/no-mutating-props
      (props.rowData.status = String(props.rowData.status));
    Object.assign(model, props.rowData);
  }
  await getRoleOptions();
  endspinLoading();
};

const closeDrawer = () => {
  visible.value = false;
  emit('update:visible', false);
};

const handleSubmit = async () => {
  try {
    await validate();
    startLoading();
    let res;

    if (isEdit.value) {
      // 编辑模式：只提取需要的字段并去除空值
      const data = uniqueEmptyValues({
        id: model.id,
        nickname: model.nickname,
        username: model.username,
        email: model.email,
        phone: model.phone,
        remark: model.remark,
        roleIds: model.roleIds,
        status: Number(model.status),
      });
      res = await userUpdateApi(data);
    } else {
      // 创建模式：使用完整model
      const data = uniqueEmptyValues({
        nickname: model.nickname,
        username: model.username,
        email: model.email,
        phone: model.phone,
        remark: model.remark,
        roleIds: model.roleIds,
        password: model.password,
        status: Number(model.status),
      });
      res = await createSystemUsersListApi(data);
    }

    // if (!res) {
    //   throw new Error('操作未成功完成');
    // }

    // 操作成功后的处理

    if (res) {
      closeDrawer();
      message.success(`${isEdit.value ? '修改' : '创建'}成功`);
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
    <Spin :spinning="spinLoading">
      <Form ref="formRef" :model="model" :rules="rules" layout="vertical">
        <FormItem label="用户名" name="username">
          <Input
            v-model:value="model.username"
            allow-clear
            placeholder="请输入用户名"
          />
        </FormItem>
        <FormItem label="昵称" name="nickname">
          <Input
            v-model:value="model.nickname"
            allow-clear
            placeholder="请输入昵称"
          />
        </FormItem>
        <FormItem label="密码" name="password" v-if="!isEdit">
          <InputPassword
            v-model:value="model.password"
            allow-clear
            placeholder="请输入密码"
          />
        </FormItem>
        <FormItem label="邮箱" name="email">
          <Input
            v-model:value="model.email"
            allow-clear
            type="email"
            placeholder="请输入邮箱"
          />
        </FormItem>
        <FormItem label="手机" name="phone">
          <Input
            v-model:value="model.phone"
            allow-clear
            type="tel"
            placeholder="请输入手机"
          />
        </FormItem>
        <FormItem label="备注" name="remark">
          <Input
            v-model:value="model.remark"
            allow-clear
            placeholder="请输入备注"
          />
        </FormItem>
        <FormItem label="角色" name="roleIds">
          <Select
            v-model:value="model.roleIds"
            mode="multiple"
            :options="roleOptions"
            placeholder="请选择角色"
          />
        </FormItem>
        <FormItem label="状态" name="status">
          <RadioGroup v-model:value="model.status">
            <Radio
              v-for="item in enableStatusOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Spin>
    <template #footer>
      <Space :size="16">
        <Button @click="closeDrawer">取消</Button>
        <Button
          :loading="loading"
          :disabled="spinLoading"
          type="primary"
          @click="handleSubmit"
        >
          确定
        </Button>
      </Space>
    </template>
  </Drawer>
</template>

<style scoped></style>
