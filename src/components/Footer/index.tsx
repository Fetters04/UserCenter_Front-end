import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Fetters04',
          blankTarget: true,
        },
        {
          key: 'CSDN',
          title: 'CSDN',
          href: 'https://blog.csdn.net/qq_53569667?spm=1000.2115.3001.5343',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
