import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import React from 'react'
import './index.less'

const data = [];
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
    this.columns = [{
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
      key:'userName',
      render: (text, record) => this.renderColumns(text, record, 'userName')
    }, {
      title: '密码',
      dataIndex: 'password',
      key:'password',
      render: (text, record) => this.renderColumns(text, record, 'password')
    },{
      title: '创建日期',
      dataIndex: 'createDate',
      key:'createDate',
    },{
      title: '更新日期',
      dataIndex: 'updateDate',
      key:'updateDate',
    }, {
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
    }];
    this.state = { data };
    this.cacheData = data.map(item => ({ ...item }));
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
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(id) {
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(id) {
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(id) {
    const newData = [...this.state.data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  handleTableChange(){

  }
  render() {
    return <Table 
              size="small"
              pagination={this.state.pagination}
              bordered
              rowKey={record => record.id}
              loading={false} 
              dataSource={this.state.data} 
              columns={this.columns} 
              onChange={this.handleTableChange}/>;
  }
}

export default UserTable;