import type { Api } from '#/typings/api';

import { requestClient } from '#/api/request';

/**
 * 获取用户列表
 */
export async function getSystemUsersApi(
  params: Api.Common.PaginatingCommonParams,
) {
  return requestClient.get('/system/users', { params });
}
/**
 * 更新用户
 */
export async function userUpdateApi(
  params: Api.User.UserUpdateParams,
  data: Api.User.UserUpdateDto,
) {
  const { id } = params;
  return requestClient.put(`/system/users/${id}`, data);
}
