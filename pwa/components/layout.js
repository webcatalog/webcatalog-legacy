import React from 'react';
import Head from 'next/head';
import { Layout, Menu, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const CustomLayout = (props) => (
    <React.Fragment>
        <Head>
      <title>WebCatalog</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/antd/3.10.0/antd.min.css' />
    </Head>
<Layout>
    <Sider theme="light" style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
      <div className="logo" />
      <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} style={{ height: '100%' }}>
        <Menu.Item key="1">
          <Icon type="user" />
          <span className="nav-text">nav 1</span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="video-camera" />
          <span className="nav-text">nav 2</span>
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="upload" />
          <span className="nav-text">nav 3</span>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="bar-chart" />
          <span className="nav-text">nav 4</span>
        </Menu.Item>
        <Menu.Item key="5">
          <Icon type="cloud-o" />
          <span className="nav-text">nav 5</span>
        </Menu.Item>
        <Menu.Item key="6">
          <Icon type="appstore-o" />
          <span className="nav-text">nav 6</span>
        </Menu.Item>
        <Menu.Item key="7">
          <Icon type="team" />
          <span className="nav-text">nav 7</span>
        </Menu.Item>
        <Menu.Item key="8">
          <Icon type="shop" />
          <span className="nav-text">nav 8</span>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ background: '#fff', padding: 0 }}>Bla</Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        {props.children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  </Layout>
    </React.Fragment>
);
  
export default CustomLayout