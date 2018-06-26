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
  state={
    data:[],
    data_bak:[]
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
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
      //this.props.updateState(data,newData);
      this.setState({data:newData});
    }
  }

  /**
   * 编辑按钮触发
   * @param {*} id 
   */
  edit(id) {
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target.editable = true;
      //this.props.updateState(data,newData);
      this.setState({data:newData});
    }
  }

  /**
   * 保存按钮触发
   * @param {*} id 
   */
  save(id) {
    const newData = [...this.state.data_bak];
    const target = newData.filter(item => id === item.id)[0];
    const target_bak = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.state.data.filter(item => id === item.id)[0]);//替换this.state.data_bak数据
      delete target.editable;
      console.log("save",target_bak)
      console.log("save",target)
      this.props.saveState(target_bak,target)
      //this.props.updateState(data,newData);
      //this.state.data = newData.map(item => ({ ...item }));
    }
  }

  /**
   * 取消按钮触发
   * @param {*} id 
   */
  cancel(id) {
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.state.data_bak.filter(item => id === item.id)[0]);
      delete target.editable;
      //this.props.updateState(data,newData);
      this.setState({data:newData});
    }
  }

  /**更新值函数 修改值时触发 */
  handleTableChange(value){
    const newData = [...this.state.data];
    //this.props.updateState(data,newData);
    this.setState({data:newData})
  }

  shouldComponentUpdate(nextProps, nextState){
    //监测this.props.data的变动
    console.log(':old props data:',this.props.data)
    console.log(':new props data:',nextProps.data)
    console.log('比较两者的区别',this.props.data==nextProps.data)
    //第一次查询
    if(this.props.data!=nextProps.data){
      nextState.data = nextProps.data;
      nextState.data_bak = nextProps.data;
    }
    //nextState
    return true;
  }

  render() {
    return <Table 
              size="small"
              bordered
              rowKey={record => record.id}
              loading={false} 
              dataSource={this.state.data} 
              columns={this.columns} 
              onChange={this.handleTableChange}/>;
  }
}

export default UserTable;