/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { history } from '@@/core/history';
import { message } from 'antd';
import { extend } from 'umi-request';

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  prefix: process.env.NODE_ENV === 'production'? 'http://user-backend.code-nav.cn': undefined,
  // requestType: 'form',
});

/**
 * 所有请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  return {
    url,
    options: {
      ...options,
      headers: {},
    },
  };
});

/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response, options): Promise<any> => {
  const res = await response.clone().json();

  if (res.code === 0) {
    return res.data;
  }

  if (res.code === 40100) {
    message.error('请先登录');
    // 重定向
    if (!history) return;
    const { search } = history.location;
    const query = new URLSearchParams(search);
    history.push({
      pathname: '/user/login',
      search: query.toString(),
    });
  } else {
    message.error(res.description);
  }

  return res.data;
});

export default request;
