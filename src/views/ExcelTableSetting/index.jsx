import React from 'react'
import { Table ,Popconfirm ,Row,Col} from 'antd';
import PanelBox from '../../components/PanelBox';
import DataTable from '../../components/DataTable';
import api from '../../api'
import { bindActionCreators } from 'redux';

export default class ExcelTableSetting extends React.Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        sqlMessageColumns : [{
          title: 'ID',
          dataIndex: 'id',
          sorter: true,
          key:'id',
          dataType:'read',
          width: '10%',
        }, {
          title: 'IP',
          dataIndex: 'ip',
          key:'ip',
        },{
          title: '用户名',
          dataIndex: 'userName',
          key:'userName',
        }, {
          title: '密码',
          dataIndex: 'password',
          key:'password',
        },{
          title: '备注',
          dataIndex: 'memo',
          key:'memo',
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
        ExcelTableColumns : [{
          title: 'ID',
          dataIndex: 'id',
          sorter: true,
          key:'id',
          dataType:'read',
          width: '10%',
        }, {
          title: '报表名称',
          dataIndex: 'tableName',
          key:'tableName',
        },{
          title: '查询语句',
          dataIndex: 'sqlText',
          key:'sqlText',
        }, {
          title: '备注',
          dataIndex: 'memo',
          key:'memo',
        },{
          title: '是否分表输出',
          dataIndex: 'isSplitTable',
          key:'isSplitTable',
        },{
          title: '编码符号',
          dataIndex: 'CodeIcon',
          key:'CodeIcon',
          dataType:'read'
        },{
          title: '部门符号',
          dataIndex: 'deptIcon',
          key:'deptIcon',
          dataType:'read'
        },{
          title: '开始日期符号',
          dataIndex: 'startDateIcon',
          key:'startDateIcon',
          dataType:'read'
        },{
          title: '结束日期符号',
          dataIndex: 'finishDateIcon',
          key:'finishDateIcon',
          dataType:'read'
        }]
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
        const systemName = target.systemName;
        const systemKey = target.systemKey;
        return api.put('/Flowt',{
            data:{systemName:systemName,systemKey:systemKey},
            type:'post',
            action:'/SystemType/AddSystemType'
          })
    }
    del(id){
      return api.put('/Flowt',{
        data:{Id:id},
        type:'post',
        action:'/SystemType/DelSystemType'
      })
    }
    FindSqlMessage(key){
        return api.put('/Flowt',{
            data:{Code:key},
            type:'get',
            action:'/SqlMessage/Find'
          })
    }
    render(){
        return(
            <div>
        <Row>
          <PanelBox title="数据库信息设置">
            <DataTable 
              columns={this.state.sqlMessageColumns} 
              Save={this.saveState.bind(this)}
              Add_NewLine={this.handleAdd.bind(this)}
              Add={this.addState.bind(this)}
              Del={this.del.bind(this)}
              Finde={this.FindSqlMessage.bind(this)}/>
          </PanelBox>
        </Row>
        <Row>
          <PanelBox title="报表设置">
            <DataTable 
              columns={this.state.ExcelTableColumns} 
              Save={this.saveState.bind(this)}
              Add_NewLine={this.handleAdd.bind(this)}
              Add={this.addState.bind(this)}
              Del={this.del.bind(this)}
              Finde={this.FindSqlMessage.bind(this)}/>
          </PanelBox>
        </Row>
      </div>
        )
    }
}