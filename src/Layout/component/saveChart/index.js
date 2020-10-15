
import React, { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { saveChart,updateChart } from '../../../Service/topologyService';

class SaveChartForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savingOrUpdating: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        return
      }

    });
  };

  handleOk = e => {
    console.log(e);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          savingOrUpdating: true
        })
        let chart_data = this.props.canvas.data
        // this.props.setSaveChartVisible(false)
        values.chart_data = chart_data;
        let activeChart = sessionStorage.getItem("activeChart")
        let callFun
        let funName = ''
        if(activeChart){
          activeChart = JSON.parse(activeChart)
          let id = activeChart.id
          funName = '更新'
          values.id = id;
          callFun = updateChart
        }else{
          funName = '保存'
          callFun = saveChart
        }

        callFun(values).then( res => {
          if(res.status === 200){
            message.success(`${funName}成功`)
            this.props.setSaveChartVisible(false)
          }else{
            message.error(res.statusText)
          }
        })
        .catch(err => {

        })
        .finally(() =>{
          this.setState({
            savingOrUpdating: false
          })
        })
      }

    });

  };

  handleCancel = e => {
    console.log(e);
    this.props.setSaveChartVisible(false)
    // this.setState({
    //   visible: false,
    // });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      let activeChart = sessionStorage.getItem("activeChart");
      if(activeChart){
        activeChart = JSON.parse(activeChart);
        this.props.form.setFieldsValue(activeChart)
      }
      
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <Modal
          title="保存组态图"
          visible={this.props.visible}
          onOk={this.handleOk}
          okButtonProps={{loading: this.state.savingOrUpdating}}
          onCancel={this.handleCancel}
        >
          <Form className="login-form">
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input name!' }],
              })(
                <Input
                  placeholder="name"
                />,
              )}
            </Form.Item>
            <Form.Item label="描述">
              {getFieldDecorator('desc', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <TextArea
                  placeholder="描述"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
    );
  }
}

const WrappedSaveChartForm = Form.create({ name: 'normal_login' })(SaveChartForm)

export default WrappedSaveChartForm