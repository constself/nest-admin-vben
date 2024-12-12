export declare namespace AntDesign {
  type TableColumnType<T> = import('ant-design-vue').TableColumnType<T>;
  type TableColumnGroupType<T> =
    import('ant-design-vue').TableColumnGroupType<T>;
  type TablePaginationConfig = import('ant-design-vue').TablePaginationConfig;
  type TableColumnCheck = import('@vben/hooks').TableColumnCheck;
  type TableDataWithIndex<T> = import('@vben/hooks').TableDataWithIndex<T>;

  type TableData = Api.Common.CommonRecord<object>;

  /**
   * the custom column key
   *
   * if you want to add a custom column, you should add a key to this type
   */
  type CustomColumnKey = 'operate';

  type SetTableColumnKey<C, T> = { key?: CustomColumnKey | keyof T } & Omit<
    C,
    'key'
  >;

  type TableColumn<T> =
    | SetTableColumnKey<TableColumnGroupType<T>, T>
    | SetTableColumnKey<TableColumnType<T>, T>;

  type TableApiFn<T = any, R = any> = (params: R) => Promise<T>;
  /**
   * the type of table operation
   *
   * - add: add table item
   * - edit: edit table item
   */
  type TableOperateType = 'add' | 'edit';

  type GetTableData<A extends TableApiFn> =
    A extends TableApiFn<infer T> ? T : never;

  type AntDesignTableConfig<A extends TableApiFn> = Pick<
    import('@vben/hooks').TableConfig<
      A,
      GetTableData<A>,
      TableColumn<TableDataWithIndex<GetTableData<A>>>
    >,
    'apiFn' | 'apiParams' | 'columns' | 'immediate'
  >;
}
