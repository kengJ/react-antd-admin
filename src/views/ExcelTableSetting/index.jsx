import React from 'react'
import { Table ,Popconfirm ,Row,Col,Button,Form} from 'antd';
import PanelBox from '../../components/PanelBox';
import DataTable from '../../components/DataTable';
import ExcelTableForm from '../../components/Form/ExcelTableForm';
import api from '../../api'
import { bindActionCreators } from 'redux';

export default class ExcelTableSetting extends React.Component {
    state = {
      visible:false,
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
          width: '5%',
        }, {
          title: '报表名称',
          dataIndex: 'tableName',
          key:'tableName',
          width:'10%'
        },{
          title: '查询语句',
          dataIndex: 'sql',
          key:'sql',
          width:'50%',
          render:(sql)=>{
            //const { sql } = record;
            return (<div>`${sql.lenght}</div>);
          }
        }, {
          title: '备注',
          dataIndex: 'memo',
          key:'memo',
        },{
          title: '分表',
          dataIndex: 'isSplitTable',
          key:'isSplitTable',
          width:'5%'
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
          tableName: '',
          sql: '',
          memo:'',
          isSplitTable:''
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

    FindExcelTable(key){
      return api.put('/Flowt',{
        data:{Code:key},
        type:'get',
        action:'/ExcelTable/Find'
      })
    }

    TipText(){
      return ""
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
                    Finde={this.FindSqlMessage.bind(this)}
                    form={ExcelTableForm}
                    />
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
                    Finde={this.FindExcelTable.bind(this)}/>
                </PanelBox>
              </Row>
            </div>
        )
    }
}