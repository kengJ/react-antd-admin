import React from 'react'
import { Table ,Popconfirm ,Row,Col} from 'antd';
import PanelBox from '../../components/PanelBox';
import DataTable from '../../components/DataTable';
import api from '../../api'
import { bindActionCreators } from 'redux';

export default class Role extends React.Component {
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
          title: '权限名称',
          dataIndex: 'roleName',
          width: '20%',
          key:'roleName',
        }, {
          title: '备注',
          dataIndex: 'memo',
          key:'memo',
        }],
    };
    constructor () {
    super()
    }
    saveState(oldData,newData){

    }
    handleAdd(){
        const newData = {
          id: '',
          roleName: '',
          memo: ''
        };
        return newData;
    }
    addState(target){
        //const username = target.userName
        //const password = target.password
        console.log(target)
        /**return api.put('/Flowt',{
          data:{UserName:username,Password:password},
          type:'post',
          action:'/User/AddUser'
        })**/
        const roleName = target.roleName;
        const memo = target.memo;
        return api.put('/Flowt',{
            data:{roleName:roleName,memo:memo},
            type:'post',
            action:'/Role/AddRole'
          })
    }
    del(){

    }
    Find(key){
        return api.put('/Flowt',{
            data:{Code:key},
            type:'get',
            action:'/Role/Find'
          })
    }
    render(){
        return(
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