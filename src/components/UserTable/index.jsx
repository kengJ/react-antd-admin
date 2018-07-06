import { Table, Input, InputNumber, Popconfirm, Form ,Button} from 'antd';
import React from 'react'
import './index.less'

const EditableCell = ({ editable, value, onChange}) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class UserTable extends React.Component {
  state={
    data:[],
    data_bak:[],
    add_btn_disabled:false
  }
  constructor(props) {
    super(props);
    let action = {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.id)}>保存</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                : <div>
                  <a onClick={() => this.edit(record.id)}>修改</a>
                  <a onClick={() => this.del(record.id)}>删除</a>
                  </div>
            }
          </div>
        );
      },
    }
    this.columns = [...this.props.columns,action]
    console.log(this.columns)
    this.columns.map(item=>{
      if((item.title!="operation")&&(item.title!="operation"&&item.dataType!="read")){
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

  add(){
    this.setState({add_btn_disabled:true})
    let line = this.props.add()
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
   * 保存按钮触发
   * @param {*} id 
   * 新增 id默认add
   * 
   */
  save(id) {
    if(id=='add'){
      const target = this.state.data.filter(item => id === item.id)[0];
      this.props.addState(target)
      if(check){
        this.setState({add_btn_disabled:false})
      }
    }else{
      const target = this.state.data.filter(item => id === item.id)[0];
      const target_bak = this.state.data_bak.filter(item => id === item.id)[0];
      if (target) {
        Object.assign(target, this.state.data.filter(item => id === item.id)[0]);//替换this.state.data_bak数据
        delete target.editable;
        this.props.saveState(target_bak,target)
      }
    }
    
  }

  /**
   * 删除按钮触发
   * @param {*} id 
   */
  del(id){
    console.log('del=>'+id)
  }

  /**
   * 取消按钮触发
   * @param {*} id 
   */
  cancel(id) {
    const newData = this.state.data.map(item => ({ ...item }))
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.state.data_bak.filter(item => id === item.id)[0]);
      delete target.editable;
      this.setState({data:newData});
    }
  }

  /**触发分页时函数 */
  handleTableChange(value){
    const newData = [...this.state.data];
    this.setState({data:newData})
  }

  shouldComponentUpdate(nextProps, nextState){
    //第一次查询
    if(this.props.data!=nextProps.data){
      nextState.data = nextProps.data.map(item => ({ ...item }))
      nextState.data_bak = nextProps.data.map(item => ({ ...item }))
      nextState.add_btn_disabled= false;
    }
    return true;
  }

  render() {
    return(
      <div>
        <Button style={{marginBottom:'10px'}} type="primary" onClick={this.add.bind(this)} disabled={this.state.add_btn_disabled}>增加</Button>
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

export default UserTable;