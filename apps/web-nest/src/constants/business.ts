import type { Api } from '#/typings/api';

import { transformRecordToOption } from '#/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, string> = {
  1: '启用',
  0: '禁用',
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const enableStatusRecordReverse = {
  0: '启用',
  1: '禁用',
};

export const enableStatusReverseOptions = transformRecordToOption(
  enableStatusRecordReverse,
);
