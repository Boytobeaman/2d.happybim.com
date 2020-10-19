import React, { useEffect, useState, useMemo } from 'react';
import { getListByPage, deleteChartByID} from '../Service/topologyService';
import { Pagination, Col, Row, Card, Avatar, Icon, Spin, message, Button,Popconfirm } from 'antd';
const { Meta } = Card;
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#f56a00'];

const Home = ({ history,props }) => {

  const [list, setList] = useState([]);

  const [currentPageIndex, setCurrentPageIndex] = useState(1);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      await setLoading(true);
      let data = await getListByPage(currentPageIndex);
      let data_list;
      let data_count;
      if(data.data && data.data.data){
        data_list = data.data.data
        data_count = data.data.count
      }
      setList(data_list);
      setTotal(data_count);
      message.success('加载成功!');
    } catch (error) {
      message.error('加载失败!');
    } finally {
      await setLoading(false);
    }
  }

  useEffect(() => {
    loadData()
  }, [currentPageIndex]);

  const onHandlePageChange = (page, size) => {
    setCurrentPageIndex(page);
  }


  const deleteChart = (item) => {
    let id  = item.id
    if(!id){
      message.error(`组态信息错误`);
    }
    deleteChartByID(id)
      .then( res => {
        debugger
        if(res.status === 200){
          message.success(`删除组态成功`);
          loadData()
        }
      })
      .catch((err) => {
        message.success(`删除组态错误`);
      })
  }



  const renderCardList = useMemo(() => {

    const onHandleDetail = item => {
      sessionStorage.setItem("activeChart",JSON.stringify(item))
      history.push({ pathname: '/workspace', state: { id: item.id,  } });
    };
  
    return list.map(item => <Col style={{ margin: '10px 0px' }} key={item.id} span={6}>
      <Card
        loading={loading}
        hoverable
        title={item.name}
        bordered={false}
        cover={<Spin spinning={loading}><div onClick={() => onHandleDetail(item)} style={{ height: 200, padding: 10, textAlign: 'center' }}><img alt="cover" style={{ height: '100%', width: '100%' }} src={`${item.feature_img ? item.feature_img.url : ''}`} /></div></Spin>}
        extra={
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {deleteChart(item)}}
            okText="确认"
            cancelText="取消"
          >
            <Button size="small">删除</Button>
          </Popconfirm>

        }
      >
        <Meta
          title={item.username}
          avatar={<Avatar style={{ backgroundColor: colorList[Math.ceil(Math.random() * 4)], verticalAlign: 'middle' }} size="large">{item.username ? item.username.slice(0, 1) : ''}</Avatar>}
          description={item.desc || '暂无描述'}
          style={{ height: 80, overflow: 'hidden' }}
        />
      </Card>
    </Col>)
  }, [list, loading, history])


  return (
    <div style={{ background: '#ECECEC', padding: '30px 200px', height: '100vh', overflow: 'auto' }}>
      <Row>
        <Col>
          <Button onClick={() => {history.push('/workspace')}}>新建组态</Button>
        </Col>
      </Row>
      <Row gutter={16}>
        {
          renderCardList
        }
      </Row>
      <Pagination style={{ textAlign: 'center', marginTop: 30 }} current={currentPageIndex} total={total} onChange={onHandlePageChange} />
    </div>
  );
};

export default Home;