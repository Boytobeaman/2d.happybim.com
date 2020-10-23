
import React, { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, message, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { saveChart,updateChart } from '../../../Service/topologyService';
import { userID as defaultUserID } from '../../../config/config'


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}




class SaveChartForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savingOrUpdating: false,
      loadingImg: false,
      imageUrl: '',
      fileList: []
    };
  }


  handleChange = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({
      loadingImg: true
    })


    getBase64(info.file, imageUrl =>
      this.setState({
        imageUrl,
        loadingImg: false,
        fileList: info.fileList
      }),
    );
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    return false
  
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
        values.users_permissions_user = defaultUserID;
        let activeChart = sessionStorage.getItem("activeChart")
        let callFun
        let funName = ''
        const formData = new FormData();

        if(activeChart){
          activeChart = JSON.parse(activeChart)
          let id = activeChart.id
          funName = '更新'
          formData.id = id;
          callFun = updateChart
        }else{
          funName = '保存'
          callFun = saveChart
        }

        

        if (this.state.fileList.length > 0) {
          let lastesFile = this.state.fileList.slice(-1)[0]
          if (lastesFile.originFileObj) {
            formData.append(`files.feature_img`, lastesFile.originFileObj, lastesFile.name);
          }
        }

        formData.append('data', JSON.stringify(values));

        callFun(formData).then( res => {
          if(res.status === 200){
            message.success(`${funName}成功`)
            let chart_data = res.data
            chart_data = JSON.stringify(chart_data)
            sessionStorage.setItem('activeChart', chart_data)
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
        let feature_img = activeChart.feature_img
        if(feature_img){
          let url = feature_img.url;
          if(feature_img.formats && feature_img.formats.thumbnail && feature_img.formats.thumbnail.url){
            url = feature_img.formats.thumbnail.url;
          }
          this.setState({
            imageUrl: url
          })
        }
      }else{
        this.props.form.setFieldsValue({})
      }
      
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loadingImg, imageUrl, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loadingImg ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传封面图片</div>
      </div>
    );

    return (
        <Modal
          title="保存组态图"
          visible={this.props.visible}
          onOk={this.handleOk}
          okButtonProps={{loading: this.state.savingOrUpdating}}
          onCancel={this.handleCancel}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            fileList={fileList}
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
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