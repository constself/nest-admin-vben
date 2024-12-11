<!-- eslint-disable no-use-before-define -->
<script lang="tsx" setup>
import { watchEffect } from 'vue';

import { Page } from '@vben/common-ui';
import { formatDateTime } from '@vben/utils';
import { VbenAvatar } from '@vben-core/shadcn-ui';

import { Button, Card, Popconfirm, Space, Table, Tag } from 'ant-design-vue';

import { getSystemUsersApi } from '#/api';
import TableHeaderOperation from '#/components/advanced/table-header-operation.vue';
import {
  useTable,
  useTableOperate,
  useTableScroll,
} from '#/hooks/common/table';

import UserOperateDrawer from './modules/user-operate-drawer.vue';
import Usersearch from './modules/user-search.vue';

const { tableWrapperRef, scrollConfig } = useTableScroll();

const {
  columns,
  columnChecks,
  data,
  getData,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams,
  originalData,
} = useTable({
  apiFn: getSystemUsersApi,
  apiParams: {
    current: 1,
    pageSize: 10,
  },
  immediate: true,
  columns: () => [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 64,
    },
    {
      key: 'avatar',
      dataIndex: 'avatar',
      title: '用户头像',
      align: 'center',
      width: 100,
      customRender: ({ text }: { text: string }) => {
        if (!text) return '-';
        return <VbenAvatar alt="用户头像" class="mx-auto size-12" src={text} />;
      },
    },
    {
      key: 'username',
      dataIndex: 'username',
      title: '用户名',
      align: 'center',
      width: 100,
    },
    {
      key: 'nickname',
      dataIndex: 'nickname',
      title: '昵称',
      align: 'center',
      width: 100,
    },
    {
      key: 'dept',
      dataIndex: 'dept',
      title: '所在部门',
      align: 'center',
      width: 100,
      customRender: ({ record }: any) => {
        return <Tag>{record.dept?.name}</Tag>;
      },
    },
    {
      key: 'roleNames',
      dataIndex: 'roleNames',
      title: '所属角色',
      align: 'center',
      width: 100,
      customRender: ({ record }: any) => (
        <Space>
          {record.roles.map(
            (item: { id: PropertyKey | undefined; name: any }) => (
              <Tag color={'success'} key={item.id}>
                {item.name}
              </Tag>
            ),
          )}
        </Space>
      ),
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: '用户邮箱',
      align: 'center',
      width: 100,
    },
    {
      key: 'phone',
      dataIndex: 'phone',
      title: '手机',
      align: 'center',
      width: 100,
    },
    {
      key: 'remark',
      dataIndex: 'remark',
      title: '备注',
      align: 'center',
      width: 100,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      customRender: ({ record }: any) => {
        const isEnable = Math.trunc(record.status) === 1;
        return (
          <Tag color={isEnable ? 'success' : 'red'}>
            {isEnable ? '启用' : '禁用'}
          </Tag>
        );
      },
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: '创建时间',
      align: 'center',
      width: 100,
      customRender: ({ text }: { text: string }) => {
        return formatDateTime(text);
      },
    },
    {
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      title: '修改时间',
      align: 'center',
      width: 100,
      customRender: ({ text }: { text: string }) => {
        return formatDateTime(text);
      },
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 130,
      fixed: 'right',
      customRender: ({ record }: any) => (
        <div class="flex-center gap-[8px]">
          <Button
            ghost
            onClick={() => edit(record.id)}
            size="small"
            type="primary"
          >
            编辑
          </Button>
          <Popconfirm title="确认删除吗？">
            <Button danger size="small">
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ],
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
} = useTableOperate(data, getData);

function edit(id: number) {
  handleEdit(id);
}

watchEffect(() => {
  if (originalData.value) {
    // console.log(originalData.value);
  }
});
</script>

<template>
  <Page content-class="flex flex-col items-stretch min-h-[500px] gap-[16px]">
    <Usersearch
      v-model:model="searchParams"
      @reset="resetSearchParams"
      @search="getData"
    />
    <Card style="width: 100%" title="用户列表">
      <template #extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :delete-show="true"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
      </template>
      <Table
        ref="tableWrapperRef"
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="mobilePagination"
        :scroll="scrollConfig"
        class="h-full"
        row-key="id"
        size="small"
      />
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </Card>
  </Page>
</template>
<style scoped></style>
