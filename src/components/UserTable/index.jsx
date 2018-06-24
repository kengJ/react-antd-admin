import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import React from 'react'
import './index.less'

let data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    id: i.toString(),
    userName: `Edrward ${i}`,
    password: '123456',
    createDate: '',
  });
}
const EditableCell = ({ editable, value, onChange }) => (
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
    //console.log('componentDidMount');
    let action = {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editable } = record;
        //console.log('editable',editable);
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
    //data = this.props.data;
    //console.log('data',data);
    //this.state = { data };
    //console.log(this.state.data)
    //console.log('columns 遍历开始')
    this.columns.map(item=>{
      if(item.title!="operation"){
        item.render=(text,record)=>this.renderColumns(text,record,`userName`)
      }
      
      //console.log(item)
    })
    console.log(this.columns)
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }
  handleChange(value, id, column) {
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
      //this.setState({ data: newData });
      this.props.updateState(data,newData);
    }
  }
  edit(id) {
    //const newData = [...this.state.data];
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target.editable = true;
      //this.setState({ data: newData });
      this.props.updateState(data,newData);
    }
  }
  save(id) {
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      delete target.editable;
      //this.setState({ data: newData });
      this.props.updateState(data,newData);
      this.state.data = newData.map(item => ({ ...item }));
    }
  }
  cancel(id) {
    const newData = [...this.props.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.props.data.filter(item => id === item.id)[0]);
      delete target.editable;
      //this.setState({ data: newData });
      //this.updateState()
      this.props.updateState(data,newData);
    }
  }
  handleTableChange(){

  }

  
  render() {
    //console.log('render data:',this.props.data)
    //this.setState({data:this.props.data});
    return <Table 
              size="small"
              //pagination={this.state.pagination}
              bordered
              rowKey={record => record.id}
              loading={false} 
              dataSource={this.props.data} 
              columns={this.columns} 
              onChange={this.handleTableChange}/>;
  }
}

export default UserTable;