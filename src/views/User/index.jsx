import React from 'react'
import { Table ,Popconfirm ,Input,Row,Col ,Button,notification,Radio, Icon} from 'antd';
import PanelBox from '../../components/PanelBox';
import UserTable from '../../components/UserTable';
import api from '../../api'
import { bindActionCreators } from 'redux';

const Search = Input.Search;

/**const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);**/

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
      //render: name => `${name.first} ${name.last}`,
      width: '10%',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      width: '20%',
      key:'userName',
      //render:(text,record)=>this.renderColumns(text,record,`userName`)
      //renders:(text,record)=>this.renderColumns(text,record,`username`)
    }, {
      title: '密码',
      dataIndex: 'password',
      key:'password',
    },{
      title: '创建日期',
      dataIndex: 'createDate',
      key:'createDate',
    },{
      title: '更新日期',
      dataIndex: 'updateDate',
      key:'updateDate',
    }],
  };
  constructor () {
    super()
  }

  

  handleTableChange(){
  }

  DelUser(id){
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.id !== id) });
    console.log('del user id is '+id);   
  }

  componentWillMount(){
    //this._isMounted = true
    
  }

  componentDidMount() {
  }

  findMenu(key){
    if(key==null||key==""){
      api.put('/Flowt',{
        data:{},
        type:'get',
        action:'/User/UserList'
      }).then(res=>{
        console.log(res.data);
        this.setState({
          data: res.data
        });
        //this.state={data:res.data}
      console.log("state",this.state);
      }).catch(err=>{
        console.log('err',err);
      });
}
  }

  searchByCode(e){
    //console.log('SearchByCode');
    let inputValue = this.refs.searchInput.refs.input.value;
    api.put('/Flowt',{
      data:{Code:inputValue},
      type:'get',
      action:'/User/UserListByCode'
    }).then(res=>{
      //console.log(res.data);
     //return res.data;
     let data = res.data.map(item=>{
        item.editable=false
     });
     this.setState({
      data: res.data
    });
    if(res.data.length==0){
      notification.open({
        message: '查询失败',
        description: <p>根据关键字<b>{inputValue}</b>查询账号，并未查询到相关条目</p>,
      });
    }
    }).catch(err=>{
      console.log(err);
    });
    //console.log(this.refs.searchInput.refs.input.value);
  }
  /**增加行数据 */
  handleAdd = () => {
    const { data } = this.state;
    const count = data.length+1;
    const newData = {
      id: '',
      userName: `userName ${count}`,
      role: '',
      updateDate: '20180622',
      createDate: '20180622',
    };
    this.setState({
      data: [...data, newData],
     //count: count + 1,
    });
    console.log(this.state.data);
    
  }

  updateState(key,value){
    this.setState({key,value})
  }

  /**renderColumns(text, record, column) {
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
  }**/

  render () {
    //this.findMenu(null)
    return (
      <div>
      <Row gutter={20}>
      <Col span={10}>
        <Input ref="searchInput" placeholder="输入用户名" style={{'marginBottom': '20px'}} />
      </Col>
      <Col><Button type="primary" onClick={this.searchByCode.bind(this)}>查询</Button></Col>
      </Row>
      <Row>
      <PanelBox title="用户列表">
      <UserTable columns={this.state.columns} data={this.state.data} updateState={this.setState.bind(this)} />
      </PanelBox>
      </Row>
      </div>
    )
  }
  }
  