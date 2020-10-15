import React, { useEffect, useState, useMemo } from 'react';
import { getListByPage } from '../Service/topologyService';
import { Pagination, Col, Row, Card, Avatar, Icon, Spin, message } from 'antd';
const { Meta } = Card;
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#f56a00'];

const Home = ({ history,props }) => {

  const [list, setList] = useState([]);

  const [currentPageIndex, setCurrentPageIndex] = useState(1);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    loadData()
  }, [currentPageIndex]);

  const onHandlePageChange = (page, size) => {
    setCurrentPageIndex(page);
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
        extra={[
          <div key="like" style={{ display: 'inline', }}><Icon type="like" /><b style={{ fontSize: 15, marginLeft: 5 }}>{item.star}</b></div>,
          <div key="heart" style={{ display: 'inline', marginLeft: 10 }}><Icon type="heart" /><b style={{ fontSize: 15, marginLeft: 5 }}>{item.recommend}</b></div>
        ]}
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