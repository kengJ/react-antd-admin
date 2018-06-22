import React from 'react'
import { Table ,Popconfirm ,Input,Row,Col ,Button,notification,Radio, Icon} from 'antd';
import PanelBox from '../../components/PanelBox';
import UserTable from '../../components/UserTable';
import api from '../../api'
import { bindActionCreators } from 'redux';

const Search = Input.Search;

export default class User extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
    columns : [{
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      key:'id',
      //render: name => `${name.first} ${name.last}`,
      width: '10%',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      width: '20%',
      key:'userName'
    }, {
      title: '密码',
      dataIndex: 'password',
      key:'password',
    },{
      title: '创建日期',
      dataIndex: 'createDate',
      key:'createDate',
    },{
      title: '更新日期',
      dataIndex: 'updateDate',
      key:'updateDate',
    },{
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        console.log(this.state.data.length);
        return (
          this.state.data.length > 0 ?
          (
            <Popconfirm title="是否删除?" onConfirm={() => this.DelUser(record.id)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          ) : null
        );
      }
    }],
  };
  constructor () {
    super()
  }

  handleTableChange(){
  }

  DelUser(id){
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.id !== id) });
    console.log('del user id is '+id);   
  }

  componentWillMount(){
    //this._isMounted = true
    this.findMenu()
  }

  componentDidMount() {
  }

  findMenu(){
    api.put('/Flowt',{
      data:{},
      type:'get',
      action:'/User/UserList'
    }).then(res=>{
      //console.log(res.data);
     //return res.data;
     this.setState({
      data: res.data
    });
    }).catch(err=>{
      console.log(err);
    });
  }

  searchByCode(e){
    //console.log('SearchByCode');
    let inputValue = this.refs.searchInput.refs.input.value;
    api.put('/Flowt',{
      data:{Code:inputValue},
      type:'get',
      action:'/User/UserListByCode'
    }).then(res=>{
      //console.log(res.data);
     //return res.data;
     this.setState({
      data: res.data
    });
    if(res.data.length==0){
      notification.open({
        message: '查询失败',
        description: <p>根据关键字<b>{inputValue}</b>查询账号，并未查询到相关条目</p>,
      });
    }
    }).catch(err=>{
      console.log(err);
    });
    //console.log(this.refs.searchInput.refs.input.value);
  }
  /**增加行数据 */
  handleAdd = () => {
    const { data } = this.state;
    const count = data.length+1;
    const newData = {
      id: '',
      userName: `userName ${count}`,
      role: '',
      updateDate: '20180622',
      createDate: '20180622',
    };
    this.setState({
      data: [...data, newData],
     //count: count + 1,
    });
    console.log(this.state.data);
    
  }
  /**
   * <Table columns={this.state.columns}
          rowKey={record => record.id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
   */
  render () {
    return (
      <div>
      <Row gutter={20}>
      <Col span={10}>
        <Input ref="searchInput" placeholder="输入用户名" style={{'marginBottom': '20px'}} />
      </Col>
      <Col><Button type="primary" onClick={this.searchByCode.bind(this)}>查询</Button></Col>
      </Row>
      <Row>
      <PanelBox title="用户列表">
      <UserTable/>
      </PanelBox>
      </Row>
      </div>
    )
  }
  }
  