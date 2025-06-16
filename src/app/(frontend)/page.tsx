import React, {use} from 'react';
import {getCategories} from "@/lib/actions/getCategories";
import CategoryCard from "@/components/category-card";
import {Row, Col, Skeleton} from 'antd';
import HeadTitle from "@/components/ui/head-title";


const HomePage = () => {
  const data = use(getCategories());

  return (
    <>
      <HeadTitle title={'Категории товаров'}/>
      <Row gutter={[16, 16]} justify="center">
        {data.length ? (
          data.map((category) => (
            <Col key={category.id} xs={24} sm={12} lg={8} xl={6}>
              <CategoryCard category={category}/>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Skeleton active/>
          </Col>
        )}
      </Row>
    </>
  );
};

export default HomePage;
