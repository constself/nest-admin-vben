import { transformRecordToOption } from '#/utils/common';

export const yesOrNoRecord: Record<CommonType.YesOrNo, string> = {
  1: '是',
  0: '否',
};

export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord);
