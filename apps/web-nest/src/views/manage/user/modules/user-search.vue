<script setup lang="ts">
import { IconIcRoundRefresh, IconIcRoundSearch } from '@vben/icons';

import { Button, Card, Col, Form, FormItem, Input, Row } from 'ant-design-vue';

import { useAntdForm } from '#/hooks/common/form';

defineOptions({
  name: 'UserSearch',
});
const emit = defineEmits<{
  (e: 'reset'): void;
  (e: 'search'): void;
}>();

const { formRef, validate, resetFields } = useAntdForm();

const model = defineModel<{
  email: string; // 昵称
  nickname: string; // 昵称
}>('model', {
  required: true,
});

async function reset() {
  await resetFields();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <Card :bordered="false" class="card-wrapper" title="搜索">
    <Form
      ref="formRef"
      :label-col="{
        span: 5,
        md: 7,
      }"
      :model="model"
      label-placement="left"
    >
      <Row :gutter="[16, 16]" wrap>
        <Col :lg="6" :md="12" :span="24">
          <FormItem class="m-0" label="昵称" name="nickname">
            <Input v-model:value="model.nickname" placeholder="请输入昵称" />
          </FormItem>
        </Col>
        <Col :lg="6" :md="12" :span="24">
          <FormItem class="m-0" label="邮箱" name="email">
            <Input v-model:value="model.email" placeholder="请输入邮箱" />
          </FormItem>
        </Col>
        <div class="flex-1">
          <FormItem class="m-0">
            <div class="flex w-full items-center justify-end gap-[12px]">
              <Button class="flex items-center" @click="reset">
                <template #icon>
                  <IconIcRoundRefresh class="align-sub text-[1.125rem]" />
                </template>
                <span class="ml-[8px]">重置</span>
              </Button>
              <Button
                class="flex items-center"
                ghost
                type="primary"
                @click="search"
              >
                <template #icon>
                  <IconIcRoundSearch class="align-sub text-[1.125rem]" />
                </template>
                <span class="ml-[8px]">搜索</span>
              </Button>
            </div>
          </FormItem>
        </div>
      </Row>
    </Form>
  </Card>
</template>

<style scoped></style>
