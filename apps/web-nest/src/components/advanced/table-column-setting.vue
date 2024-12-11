<script setup lang="ts" generic="T extends Record<string, unknown>, K = never">
import type { AntDesign } from '@vben/types';

import { VueDraggable } from 'vue-draggable-plus';

import { AntDesignSettingOutlined, MdiDrag } from '@vben/icons';

import { Button, Checkbox, Popover } from 'ant-design-vue';

defineOptions({
  name: 'TableColumnSetting',
});

const columns = defineModel<AntDesign.TableColumnCheck[]>('columns', {
  required: true,
});
</script>

<template>
  <Popover placement="bottomRight" trigger="click">
    <Button class="flex items-center" size="small">
      <template #icon>
        <AntDesignSettingOutlined class="align-sub text-[1.125rem]" />
      </template>
      <span class="ml-[8px]">列设置</span>
    </Button>
    <template #content>
      <VueDraggable v-model="columns" :animation="150" filter=".none_draggable">
        <div
          v-for="item in columns"
          :key="item.key"
          class="hover:bg-primary/10 flex h-[36px] items-center rounded-[4px] hover:bg-opacity-10"
        >
          <MdiDrag class="mr-[8px] h-full cursor-move text-[1.125rem]" />
          <Checkbox
            v-model:checked="item.checked"
            class="none_draggable flex-1"
          >
            {{ item.title }}
          </Checkbox>
        </div>
      </VueDraggable>
    </template>
  </Popover>
</template>

<style scoped></style>
