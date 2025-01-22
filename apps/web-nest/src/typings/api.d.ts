/**
 * Namespace Api
 *
 * All backend api type
 */
export declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      page: number;
      /** page size */
      pageSize: number;

      [key: string]: any;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<
      Common.PaginatingCommonParams,
      'current' | 'size'
    >;
    /**
     * enable status
     *
     * - "1": enabled
     * - "0": disabled
     */
    type EnableStatus = '0' | '1';
  }
  namespace User {
    /**
     * 用户更新 dto
     */
    type UserUpdateDto = {
      /** 头像 */
      avatar?: string;
      /** 归属大区 */
      deptId?: number;
      /** 邮箱 */
      email?: string;
      /** 用户ID */
      id: number;
      /** 呢称 */
      nickname?: string;
      /** 登录密码 */
      password?: string;
      /** 手机号 */
      phone?: string;
      /** QQ */
      qq?: string;
      /** 备注 */
      remark?: string;
      /** 归属角色 */
      roleIds?: number[];
      /** 状态 */
      status?: 0 | 1;
      /** 登录账号 */
      username?: string;
    };
  }
}
