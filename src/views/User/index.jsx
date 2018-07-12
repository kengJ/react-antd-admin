import React from 'react'
import { Table ,Popconfirm ,Row,Col} from 'antd';
import PanelBox from '../../components/PanelBox';
import DataTable from '../../components/DataTable';
import api from '../../api'
import { bindActionCreators } from 'redux';



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
      dataType:'read',
      width: '10%',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      width: '20%',
      key:'userName',
    }, {
      title: '密码',
      dataIndex: 'password',
      key:'password',
    },{
      title: '创建日期',
      dataIndex: 'createDate',
      key:'createDate',
      dataType:'read'
    },{
      title: '更新日期',
      dataIndex: 'updateDate',
      key:'updateDate',
      dataType:'read'
    }],
  };
  constructor () {
    super()
  }

  Find(key){
    return api.put('/Flowt',{
      data:{Code:key},
      type:'get',
      action:'/User/FindUser'
    })
  }

  /**增加行数据 */
  handleAdd = () => {
    const { data } = this.state;
    const count = data.length+1;
    const newData = {
      id: '',
      userName: '',
      role: '',
      updateDate: '',
      createDate: '',
      password:''
    };
    return newData;
  }

  addState(target){
    const username = target.userName
    const password = target.password

    return api.put('/Flowt',{
      data:{UserName:username,Password:password},
      type:'post',
      action:'/User/AddUser'
    })
  }

  saveState(oldData,newData){
    return api.put('/Flowt',{
      data:{oldData:oldData,newData:newData},
      type:'post',
      action:'/User/UpdateUserById'
    })
  }

  del(id){
    return api.put('/Flowt',{
      data:{Id:id},
      type:'post',
      action:'/User/DelUser'
    })
  }

  render () {
    return (
      <div>
        <Row>
          <PanelBox title="用户列表">
            <DataTable 
              columns={this.state.columns} 
              Save={this.saveState.bind(this)}
              Add_NewLine={this.handleAdd.bind(this)}
              Add={this.addState.bind(this)}
              Del={this.del.bind(this)}
              Finde={this.Find.bind(this)}/>
          </PanelBox>
        </Row>
      </div>
    )
  }
  }
  