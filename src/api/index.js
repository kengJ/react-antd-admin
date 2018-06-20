var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
var normalAxios = axios.create();
var mockAxios = axios.create();

// mock 数据
var mock = new MockAdapter(mockAxios);

/**
mock.onPut('/login').reply(config => {
  console.log(config);
  let postData = JSON.parse(config.data).data;
  if (postData.user === 'admin' && postData.password === '123456') {
    return [200, require('./mock/user') ];
  } else {
    return [500, {message: "Incorrect user or password"} ];
  }
});**/

/****/
mock.onPut('/login').reply(config =>{
  //console.log(config);
  let postData = JSON.parse(config.data).data;
  return new Promise(function(resolve, reject){
    axios.post('/flowtapi/Flowt/Login/CheckUserName',{UserName:'admin'}
    ).then((res)=>{
      resolve([200, res.data ]);
    }).catch(err=>{
      resolve([500, err ]);
    });
  });
});

mock.onGet('/logout').reply(200, {});
mock.onGet('/my').reply(200, require('./mock/user'));
//mock.onGet('/menu').reply(200, require('./mock/menu'));
mock.onGet('/menu').reply(config=>{
  //console.log('menu',config.role);
  //let role = JSON.parse(config.role);
  let role = config.role;
  console.log('menu',config);
  if(role=="ADMIN"){
    return [200, require('./mock/menuadmin') ];
  }else{
    return [200, require('./mock/menudefault') ];
  }
});
mock.onGet('/randomuser').reply((config) => {
  return new Promise(function(resolve, reject) {
    normalAxios.get('https://randomuser.me/api', {
      params: {
        results: 10,
        ...config.params,
      },
      responseType: 'json'
    }).then((res) => {
      resolve([200, res.data ]); 
    }).catch((err) => {
      resolve([500, err ]);
    });
  });
});

/**
 * 后台接口
 */
mock.onPut('/Flowt').reply(config=>{
  console.log(config);
  let basicUrl = 'http://127.0.0.1:8080/Flowt';
  let postData = JSON.parse(config.data).data;
  let action = JSON.parse(config.data).action;
  let type = JSON.parse(config.data).type;
  return new Promise(function(resolve, reject){
    if(type=="post"){
      normalAxios.post(
        basicUrl+action,
        postData
      ).then((res)=>{
        resolve([200, res.data ]);
      }).catch(err=>{
        resolve([500, err ]);
      });
    }else{
      normalAxios.get(
        basicUrl+action, 
        {
        params: {
          postData,
        },
        responseType: 'json'
      }).then((res) => {
        resolve([200, res.data ]); 
      }).catch((err) => {
        resolve([500, err ]);
      });
    }
  });
});


export default mockAxios;
