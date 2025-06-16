'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {Layout, Typography, Row, Col, Drawer, Button} from 'antd';
import {MenuOutlined} from '@ant-design/icons';
import './index.css'

const {Text} = Typography;

const Header = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Layout.Header style={{backgroundColor: '#efefef', padding: '0 16px'}}>
      <div className="container mx-auto max-w-[1440px]">
        <Row justify="space-between" align="middle">
          <Col>
            <Link href="/" className="text-white hover:opacity-80">
              <span className="text-xl font-bold">Логотип</span>
            </Link>
          </Col>

          <Col className="mobile-menu">
            <Button
              type="text"
              icon={<MenuOutlined/>}
              onClick={showDrawer}
              style={{color: '#333'}}
            />
          </Col>

          <Col className="desktop-menu">
            <Row gutter={16} align="middle">
              <Col>
                <Text style={{color: '#333'}} className="text-sm">
                  +7 (900) 000 00 00
                </Text>
              </Col>
              <Col>
                <Link href="/checkout" className="text-white hover:opacity-80">
                  <Text style={{color: '#333'}}>Корзина</Text>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>

        <Drawer
          title="Меню"
          placement="right"
          onClose={closeDrawer}
          open={open}
          width={250}
        >
          <div>
            <Text style={{color: '#333'}} className="text-sm">
              +7 (900) 000 00 00
            </Text>
          </div>
          <div style={{marginTop: '10px'}}>
            <Link href="/checkout">
              <Button type="link">Корзина</Button>
            </Link>
          </div>
        </Drawer>
      </div>
    </Layout.Header>
  );
};

export default Header;
