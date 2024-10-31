import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, Link, useModel } from '@umijs/max';
import { Alert, Divider, message, Space, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  // 表单提交
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const user = await login(values);
      if (user) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();

        // 重定向
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');

        return;
      }

      setUserLoginState(user);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  const status = userLoginState ? userLoginState.status : null;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={
            <img
              alt="logo"
              src="https://img1.baidu.com/it/u=4040569391,2679841475&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
            />
          }
          title="用户中心"
          subTitle={'一个统一的用户登录平台'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
            ]}
          />

          {status === 'error' && <LoginMessage content={'账号密码错误'} />}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '长度不小于 8 位',
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && <LoginMessage content="验证码错误" />}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Space split={<Divider type="vertical" />} align={'center'}>
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <Link to="/user/register">新用户注册</Link>
              <a
                style={{
                  float: 'right',
                }}
                href="https://blog.csdn.net/qq_53569667?spm=1000.2115.3001.5343"
                target="_blank"
                rel="noreferrer"
              >
                忘记密码
              </a>
            </Space>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
