import React, { useMemo, useEffect } from 'react';
import { Form, Tabs, Row, Col, Input, Collapse } from 'antd';
import './index.css';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const CanvasProps = ({ data, form: { getFieldDecorator }, form }) => {

  const { bkColor, bkImage } = data.data

  useEffect(() => {
    form.validateFields((err, value) => {
      if (err) return;
      data.clearBkImg();
      data.data.bkColor = value.bkColor;
      data.data.bkImage = value.bkImage;
      data.render();
      form.resetFields();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  /**
  * 渲染位置和大小的表单
  */

  const renderForm = useMemo(() => {
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };
    return <Form {...formLayout}>
      <Row>
        <Col span={24}>
          <Form.Item label="背景颜色">
            {getFieldDecorator('bkColor', {
              initialValue: bkColor
            })(<Input type="color" />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="背景图片">
            {getFieldDecorator('bkImage', {
              initialValue: bkImage
            })(<Input placeholder="请输入图片的地址" />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }, [bkColor, bkImage, getFieldDecorator]);

  return (
    <div className="rightArea">
      <Tabs defaultActiveKey="1">
        <TabPane tab="背景" key="1" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="样式" key="1">
              {
                renderForm
              }
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>

    </div>
  );
};

export default Form.create()(CanvasProps);