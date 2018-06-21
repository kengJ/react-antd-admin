import React from 'react'
import { Table } from 'antd';
import PanelBox from '../../components/PanelBox';
import api from '../../api'
/**const columns = [{
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
  dataIndex: '',
  key:'action',
  render:record=>{
    let id = record.id;
    return <a>删除</a>
  }
}];**/

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
      dataIndex: '',
      key:'action',
      render:record=><a>删除</a>
    }],
  };
  constructor () {
    super()
    this.findMenu()
  }
  handleTableChange(){

  }
  DelUser(id){
    console.log('del user id is '+id);
  }

  componentDidMount() {
    //this.fetch();
    
  }

  findMenu(){
    api.put('/Flowt',{
      data:{},
      type:'get',
      action:'/User/UserList'
    }).then(res=>{
      //console.log(res.data);
      this.setState({'data':res.data});
    }).catch(err=>{
      console.log(err);
    });
  }
  
  render () {
    return (
      <PanelBox title="用户列表">
      <Table columns={this.state.columns}
        //rowKey={record => record.registered}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    </PanelBox>
    )
  }
  }
  