import type { Api } from '#/typings/api';

import { requestClient } from '#/api/request';

/**
 * 获取系统用户列表的API接口
 *
 * @param params 分页参数对象
 * @returns 系统用户信息数据
 */
export async function getSystemUsersListApi(
  params: Api.Common.PaginatingCommonParams,
) {
  return requestClient.get('/system/users', { params });
}

/**
 * 创建系统用户列表的API
 *
 * @param data 需要提交的数据
 * @returns 返回请求结果
 */
export async function createSystemUsersListApi(data: any) {
  return requestClient.post('/system/users', data);
}
/**
 * 更新用户信息的API请求函数
 *
 * @param data 包含用户更新信息的对象，遵循Api.User.UserUpdateDto类型定义
 * @returns 返回更新用户信息的请求结果
 */
export async function userUpdateApi(data: Api.User.UserUpdateDto) {
  return requestClient.post(`/system/users/update`, data);
}

/**
 * 获取系统角色列表的API接口
 *
 * @param params 分页参数
 * @returns 系统角色列表数据
 */
export async function getSystemRolesApi(
  params?: Api.Common.PaginatingCommonParams,
) {
  return requestClient.get('/system/roles', { params });
}
