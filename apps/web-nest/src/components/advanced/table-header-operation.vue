<script setup lang="ts">
import type { AntDesign } from '@vben/types';

import {
  IconIcRoundDelete,
  IconIcRoundPlus,
  IconIcRoundRefresh,
} from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, Popconfirm } from 'ant-design-vue';

import TableColumnSetting from './table-column-setting.vue';

defineOptions({
  name: 'TableHeaderOperation',
});

defineProps<{
  addShow?: boolean;
  deleteShow?: boolean;
  disabledDelete?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
}>();

const columns = defineModel<AntDesign.TableColumnCheck[]>('columns', {
  default: () => [],
});

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <div
    class="lt-sm:(w-[200px] py-[12px]) flex flex-wrap justify-end gap-x-[12px] gap-y-[8px]"
  >
    <slot name="prefix"></slot>
    <slot name="default">
      <Button
        v-show="!addShow"
        class="flex items-center"
        ghost
        size="small"
        type="primary"
        @click="add"
      >
        <template #icon>
          <IconIcRoundPlus class="align-sub text-[1.125rem]" />
        </template>
        <span class="ml-[8px]">新增</span>
      </Button>
      <Popconfirm
        :disabled="disabledDelete"
        description="确认删除吗？"
        @confirm="batchDelete"
      >
        <Button
          v-show="!deleteShow"
          :disabled="disabledDelete"
          class="flex items-center"
          danger
          size="small"
        >
          <template #icon>
            <IconIcRoundDelete class="align-sub text-[1.125rem]" />
          </template>
          <span class="ml-[8px]">批量删除</span>
        </Button>
      </Popconfirm>
    </slot>
    <Button class="flex items-center" size="small" @click="refresh">
      <template #icon>
        <IconIcRoundRefresh class="align-sub text-[1.125rem]" />
      </template>
      <span class="ml-[8px]">{{ $t('common.refresh') }}</span>
    </Button>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped></style>
