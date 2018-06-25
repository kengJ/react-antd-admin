import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
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
                : <a onClick={() => this.edit(record.id)}>修改</a>
            }
          </div>
        );
      },
    }
    this.columns = [...this.props.columns,action]
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
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
      this.props.updateState(data,newData);
    }
  }

  /**
   * 编辑按钮触发
   * @param {*} id 
   */
  edit(id) {
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target.editable = true;
      this.props.updateState(data,newData);
    }
  }

  /**
   * 保存按钮触发
   * @param {*} id 
   */
  save(id) {
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      delete target.editable;
      this.props.updateState(data,newData);
      this.state.data = newData.map(item => ({ ...item }));
    }
  }

  /**
   * 取消按钮触发
   * @param {*} id 
   */
  cancel(id) {
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.props.data.filter(item => id === item.id)[0]);
      delete target.editable;
      this.props.updateState(data,newData);
    }
  }

  /**更新值函数 修改值时触发 */
  handleTableChange(value){
    const newData = [...this.props.data];
    this.props.updateState(data,newData);
  }

  shouldComponentUpdate(nextProps, nextState){
    
    console.log('componentWillUpdata:data=>',this.props.data)
    console.log('componentWillUpdata:data=>',nextProps.data)
    //nextState
    return true;
  }

  render() {
    return <Table 
              size="small"
              bordered
              rowKey={record => record.id}
              loading={false} 
              dataSource={this.props.data} 
              columns={this.columns} 
              onChange={this.handleTableChange}/>;
  }
}

export default UserTable;