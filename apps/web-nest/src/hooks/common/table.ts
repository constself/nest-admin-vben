import type { TableRowSelection } from 'ant-design-vue/es/table/interface';

import type { AntDesign } from '#/typings/antd';

import {
  computed,
  effectScope,
  onScopeDispose,
  reactive,
  ref,
  shallowRef,
  toValue,
  watch,
} from 'vue';
import type { MaybeRef, Ref } from 'vue';

import { jsonClone, useBoolean, useHookTable } from '@vben/hooks';
import { useIsMobile, useSimpleLocale } from '@vben-core/composables';

import { useElementSize } from '@vueuse/core';
import { message, type TablePaginationConfig } from 'ant-design-vue';

type TableData = AntDesign.TableData;
type GetTableData<A extends AntDesign.TableApiFn> = AntDesign.GetTableData<A>;
type TableColumn<T> = AntDesign.TableColumn<T>;

const dataScroll = ref<TableData[]>([]); // 处理表体滚动条高度

export function useTable<A extends AntDesign.TableApiFn>(
  config: AntDesign.AntDesignTableConfig<A>,
) {
  const scope = effectScope();
  const { isMobile } = useIsMobile();
  const { currentLocale } = useSimpleLocale();

  const { apiFn, apiParams, immediate } = config;
  const originalDataRef = ref<any>(null);
  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams,
  } = useHookTable<
    A,
    GetTableData<A>,
    TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>
  >({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: (res) => {
      const list = res.items || {};
      const {
        currentPage: current,
        totalItems: total,
        itemsPerPage: size,
      } = res.meta || {};

      // Ensure that the size is greater than 0, If it is less than 0, it will cause paging calculation errors.
      const pageSize = size <= 0 ? 10 : size;

      originalDataRef.value = res;
      dataScroll.value = list;
      const recordsWithIndex = list.map((item: any, index: number) => {
        return {
          ...item,
          index: (current - 1) * pageSize + index + 1,
        };
      });

      return {
        data: recordsWithIndex,
        pageNum: current,
        pageSize,
        total,
      };
    },
    getColumnChecks: (cols) => {
      const checks: AntDesign.TableColumnCheck[] = [];

      cols.forEach((column) => {
        if (column.key) {
          checks.push({
            key: column.key as string,
            title: column.title as string,
            checked: true,
          });
        }
      });

      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<GetTableData<A>>>();

      cols.forEach((column) => {
        if (column.key) {
          columnMap.set(column.key as string, column);
        }
      });

      const filteredColumns = checks
        .filter((item) => item.checked)
        .map(
          (check) => columnMap.get(check.key) as TableColumn<GetTableData<A>>,
        );

      return filteredColumns;
    },
    onFetched: async (transformed) => {
      const { pageNum, pageSize, total } = transformed;

      updatePagination({
        current: pageNum,
        pageSize,
        total,
      });
    },
    immediate,
  });

  const pagination: TablePaginationConfig = reactive({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '20', '25', '30'],
    total: 0,
    showTotal: (total, range) => {
      return `${range[0]}-${range[1]} 共${total}条`;
    },
    onChange: async (current: number, pageSize: number) => {
      pagination.current = current;

      updateSearchParams({
        current,
        pageSize,
      });

      getData();
    },
  });

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: TablePaginationConfig = {
      ...pagination,
      simple: isMobile.value,
    };

    return p;
  });

  function updatePagination(update: Partial<TablePaginationConfig>) {
    Object.assign(pagination, update);
  }

  /**
   * get data by page number
   *
   * @param pageNum the page number. default is 1
   */
  async function getDataByPage(pageNum: number = 1) {
    updatePagination({
      current: pageNum,
    });

    updateSearchParams({
      current: pageNum,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      pageSize: pagination.pageSize!,
    });

    await getData();
  }

  scope.run(() => {
    watch(
      () => currentLocale,
      () => {
        reloadColumns();
      },
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });
  const originalData = computed(() => originalDataRef.value);
  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    getDataByPage,
    searchParams,
    updateSearchParams,
    resetSearchParams,
    originalData,
  };
}

export function useTableOperate<T extends TableData = TableData>(
  data: Ref<T[]>,
  getData: () => Promise<void>,
) {
  const {
    bool: drawerVisible,
    setTrue: openDrawer,
    setFalse: closeDrawer,
  } = useBoolean();

  const operateType = ref<AntDesign.TableOperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData: Ref<null | T> = ref(null);

  function handleEdit(id: T['id']) {
    operateType.value = 'edit';
    const findItem = data.value.find((item) => item.id === id) || null;
    editingData.value = jsonClone(findItem);

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys: Ref<T['id'][]> = ref([]);

  function onSelectChange(keys: (number | string)[]) {
    checkedRowKeys.value = keys as T['id'][];
  }

  const rowSelection = computed<TableRowSelection<T>>(() => {
    return {
      columnWidth: 48,
      type: 'checkbox',
      selectedRowKeys: checkedRowKeys.value,
      onChange: onSelectChange,
    };
  });

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    message?.success('删除成功');

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    message?.success('删除成功');

    await getData();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onSelectChange,
    rowSelection,
    onBatchDeleted,
    onDeleted,
  };
}

export function useTableScroll(scrollX: MaybeRef<number> = 702) {
  const tableWrapperRef = shallowRef<HTMLElement | null>(null);
  const { height: wrapperElHeight } = useElementSize(tableWrapperRef);

  const scrollConfig = computed(() => {
    return {
      y:
        dataScroll.value.length > 0
          ? wrapperElHeight.value - 72
          : wrapperElHeight.value,
      x: toValue(scrollX),
    };
  });
  return {
    tableWrapperRef,
    scrollConfig,
  };
}
