import React from 'react'
import { Form,Modal,Input, Radio} from 'antd';

const FormItem = Form.Item;

class ExcelTableForm extends React.Component {
    state={
        defaultValue:{

        },
        value:{}
    }
    constructor(props){
        super(props);
        console.log('constructor')
    }
    
    componentDidMount(state,props){
        console.log('componentDidMount')
        //props.value变更时触发
        if(this.props.value!=props.value&&props!=undefined){

        }
        return true;
    }
    render(){
        const { visible, onCancel, onCreate, form,defaultValue } = this.props;
        const { getFieldDecorator } = form;
        return(
            <Modal
                visible={visible}
                title="Create a new collection"
                okText="Create"
                onCancel={onCancel}
                onOk={onCreate}
                >
                <Form layout="vertical">
                    <FormItem label="Title">
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Please input the title of collection!' }],
                        initialValue:this.state.value.title
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem label="Description">
                    {getFieldDecorator('description',{
                        initialValue:this.state.value.description
                    })(<Input type="textarea" />)}
                    </FormItem>
                    <FormItem className="collection-create-form_last-form-item">
                    {getFieldDecorator('modifier', {
                       initialValue:this.state.value.modifier,
                    })(
                        <Radio.Group>
                        <Radio value="public">Public</Radio>
                        <Radio value="private">Private</Radio>
                        </Radio.Group>
                    )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(ExcelTableForm)