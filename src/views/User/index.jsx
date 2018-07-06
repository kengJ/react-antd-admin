import React from 'react'
import { Table ,Popconfirm ,Input,Row,Col ,Button,message,Radio, Icon} from 'antd';
import PanelBox from '../../components/PanelBox';
import UserTable from '../../components/UserTable';
import api from '../../api'
import { bindActionCreators } from 'redux';

const Search = Input.Search;

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
      dataType:'read',
      width: '10%',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      width: '20%',
      key:'userName',
    }, {
      title: '密码',
      dataIndex: 'password',
      key:'password',
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
      console.log("state",this.state);
      }).catch(err=>{
        console.log('err',err);
      });
}
  }

  searchByCode(e){
    let inputValue = this.refs.searchInput.refs.input.value;
    api.put('/Flowt',{
      data:{Code:inputValue},
      type:'get',
      action:'/User/UserListByCode'
    }).then(res=>{
     this.setState({
      data: res.data
    });
    if(res.data.length==0){
      message.error('查询失败:'+'根据关键字'+inputValue+'查询账号，并未查询到相关条目')
    }
    }).catch(err=>{
      console.log(err);
    });
  }
  /**增加行数据 */
  handleAdd = () => {
    const { data } = this.state;
    const count = data.length+1;
    const newData = {
      id: '',
      userName: '',
      role: '',
      updateDate: '',
      createDate: '',
      password:''
    };
    return newData;
  }

  addState(target){
    const username = target.userName
    const password = target.password
    console.log('addState=>username',username)
    console.log('addState=>pasword',password)

    api.put('/Flowt',{
      data:{UserName:username,Password:password},
      type:'post',
      action:'/User/AddUser'
    }).then(res=>{
    console.log(res.data)
    if(res.data.key=="success"){
      message.info('已添加账号:'+res.data.value.userName)
      this.findMenu(null)
      //this.saveState({data:res.data.value})
    }else{
      message.error('增加失败:'+'账号已存在')
      return false;
    }
    }).catch(err=>{
      console.log(err);
    });
  }

  updateState(key,value){
    this.setState({key,value})
  }

  saveState(oldData,newData){
    api.put('/Flowt',{
      data:{oldData:oldData,newData:newData},
      type:'post',
      action:'/User/UpdateUserById'
    }).then(res=>{
    console.log(res.data)
    if(res.data.key=="success"){
      this.findMenu(null)
      //this.saveState({data:res.data.value})
    }else{
      message.error('更新失败,数据已被更新')
    }
    }).catch(err=>{
      console.log(err);
    });
    //console.log(id);
    //console.log(data);
  }

  del(id){
    api.put('/Flowt',{
      data:{Id:id},
      type:'post',
      action:'/User/DelUser'
    }).then(res=>{
    console.log(res.data)
    if(res.data.key=="success"){
      message.info(res.data.value)
      this.findMenu(null)
    }else{
      message.error(res.data.value)
    }
    }).catch(err=>{
      console.log(err);
    });
  }

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
      <UserTable 
        columns={this.state.columns} 
        data={this.state.data} 
        updateState={this.setState.bind(this)} 
        saveState={this.saveState.bind(this)}
        add={this.handleAdd.bind(this)}
        addState={this.addState.bind(this)}
        del={this.del.bind(this)}/>
      </PanelBox>
      </Row>
      </div>
    )
  }
  }
  