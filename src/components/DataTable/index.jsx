import { Table, Input, InputNumber, Popconfirm, Form ,Button,message,Row,Col} from 'antd';
import React from 'react'
import './index.less'
//import {ExportJsonExcel } from 'js-export-excel';

const Search = Input.Search;

const EditableCell = ({ editable, value, onChange}) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class DataTable extends React.Component {
  state={
    data:[],
    data_bak:[],
    add_btn_disabled:false
  }
  constructor(props) {
    super(props);
    let action = {
      title: '操作',
      dataIndex: 'operation',
      width:'150px',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations" style={{width:'150px'}}>
            {
              editable ?
                <span>
                  <Button type="primary" onClick={() => this.save(record.id)} style={{marginRight:'5px'}}>保存</Button>
                  <Popconfirm title="是否取消?" onConfirm={() => this.cancel(record.id)}>
                    <Button type="primary">取消</Button>
                  </Popconfirm>
                </span>
                : <div>
                  <Button type="primary" onClick={() => this.edit(record.id)}style={{marginRight:'5px'}}>修改</Button>
                  <Button type="danger" onClick={() => this.del(record.id)}>删除</Button>
                  </div>
            }
          </div>
        );
      },
    }
    this.columns = [...this.props.columns,action]
    this.columns.map(item=>{
      if((item.dataIndex!="operation")&&(item.dataIndex!="operation"&&item.dataType!="read")){
        item.render=(text,record)=>this.renderColumns(text,record,item.dataIndex)
      }
    })
  }
  /**
   * 加载编辑模块
   * @param {*} text 
   * @param {*} record 
   * @param {*} column 
   */
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }

  /**
   * 编辑模块 输入框更改时触发
   * @param {*} value 
   * @param {*} id 
   * @param {*} column 
   */
  handleChange(value, id, column) {
    const newData = this.state.data.map(item => ({ ...item }))
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
    }
    this.setState({data:newData})
  }

  /**触发增加按钮 
   * 增加一行新数据，可编辑
  */
  add(){
    this.setState({add_btn_disabled:true})
    let line = this.props.Add_NewLine()
    const newData = this.state.data.map(item => ({ ...item }))
    line.editable = true;
    line.id = 'add'
    newData.push(line);
    this.setState({data:newData})
  }

  /**
   * 编辑按钮触发
   * @param {*} id 
   */
  edit(id) {
    const newData = this.state.data.map(item => ({ ...item }))
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({data:newData})
    }
  }

  /**
   * 取消按钮触发
   * @param {*} id 
   */
  cancel(id) {
    if(id=="add"){
      this.setState({add_btn_disabled:false})
    }
    const newData = this.state.data.map(item => ({ ...item }))
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.state.data_bak.filter(item => id === item.id)[0]);
      delete target.editable;
      this.setState({data:newData});
    }
  }

  /**
   * 核心查询函数
   * @param {*} value 
   */
  Find(value,isMessage=false){
    const api = this.props.Finde(value)
    api.then(res=>{
      if(res.data.key=="success"){
        
        this.setState({add_btn_disabled:false})
        
        //if(isMessage)message.info('查询成功')
        //console.log(res.data.value)
        message.info(res.data.value)
        //message.info('查询成功')
        this.setState({data:res.data.list,data_bak:res.data.list.map(item=>({...item}))})
        
      }else{
        message.error(res.data.value)
      }
    }).catch(err=>{
      message.error('查询错误')
    })
  }

  /**
   * 保存按钮触发
   * @param {*} id 
   * 新增 id默认add
   */
  save(id) {
    if(id=='add'){
      const target = this.state.data.filter(item => id === item.id)[0];
      const api = this.props.Add(target)
      
      api.then(res=>{
        if(res.data.key=="success"){
          message.info(res.data.value)
          this.setState({add_btn_disabled:false})
          this.Find("")
        }else{
          message.error(res.data.value)
        }
      }).catch(err=>{
        message.error('增加新数据错误')
      })
    }else{
      const target = this.state.data.filter(item => id === item.id)[0];
      const target_bak = this.state.data_bak.filter(item => id === item.id)[0];
      if (target) {
        Object.assign(target, this.state.data.filter(item => id === item.id)[0]);//替换this.state.data_bak数据
        delete target.editable;
        const api = this.props.Save(target_bak,target)
        api.then(res=>{
          if(res.data.key=="success"){
            message.info('数据更新成功')
            this.Find("")
          }else{
            message.error('更新失败,数据已被更新')
          }
        }).catch(err=>{
          message.error('保存数据错误')
        })
      }
    }
  }

  /**
   * 删除按钮触发
   * @param {*} id 
   */
  del(id){
    const api = this.props.Del(id)
    api.then(res=>{
      if(res.data.key=="success"){
        message.info(res.data.value)
        this.Find("")
      }else{
        message.error(res.data.value)
      }
    }).catch(err=>{
      message.error('删除错误')
    })
  }

  /**
   * 查询框出发
   * @param {*} e 
   */
  searchByCode(e){
    let inputValue = this.refs.searchInput.refs.input.value;
    this.Find(inputValue,true)  
  }

  /**触发分页时函数 */
  handleTableChange(value){
    const newData = [...this.state.data];
    this.setState({data:newData})
  }

  /**
   * 导出按钮触发
   */
  Excel(){
    const head = []
    const keys = []
    this.columns.map(item=>{
      if(item.dataIndex!="operation"){
        head.push(item.title)
        keys.push(item.key)
      }
    })
    //console.log(head)
    const ExportJsonExcel = require('js-export-excel')
    let option={};
    option.fileName = 'excel'
    option.datas=[
      {
        sheetData:this.state.data_bak,
        sheetName:'sheet',
        sheetFilter:keys,
        sheetHeader:head
      },
      {
        sheetData:[{one:'一行一列',two:'一行二列'},{one:'二行一列',two:'二行二列'}]
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel(); //保存
  }

  Input(){

  }

  render() {
    return(
      <div>
        <Row gutter={20}>
          <Col span={5}>
            <Button style={{marginBottom:'10px'}} type="primary" onClick={this.add.bind(this)} disabled={this.state.add_btn_disabled} style={{marginRight:'5px'}}>增加</Button>
            <Button style={{marginBottom:'10px'}} type="primary" onClick={this.Excel.bind(this)} style={{marginRight:'5px'}}>导出</Button>
            <Button style={{marginBottom:'10px'}} type="primary" onClick={this.Input.bind(this)} style={{marginRight:'5px'}} disabled={true}>导入</Button>
          </Col>
          <Col span={10}>
            <Input ref="searchInput" placeholder="输入查询内容" style={{'marginBottom': '20px'}} />
          </Col>
          <Col><Button type="primary" onClick={this.searchByCode.bind(this)}>查询</Button></Col>
        </Row>
        
        <Table 
                size="small"
                bordered
                rowKey={record => record.id}
                loading={false} 
                dataSource={this.state.data} 
                columns={this.columns} 
                onChange={this.handleTableChange}></Table>
      </div>
    ) 
    
  }
}

export default DataTable;