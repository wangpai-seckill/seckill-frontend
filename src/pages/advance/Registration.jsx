import {Button, Card, Form, Toast} from '@douyinfe/semi-ui';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

import common from '../../css/common.module.scss';
import bgChange from '../../css/bgChange-normal.module.scss';

export default function Registration(props) {
    const navigate = useNavigate();

    const register = (registrationVo) => {
        axios({
            method: "post",
            url: `/backend/user/registration/`,
            data: {
                phone: registrationVo.phone,
                userName: registrationVo.userName,
                password: registrationVo.password,
            }
        }).then((rsp) => {
            const rspData = rsp.data;

            Toast.info(rspData.msg);

            if (rspData.state === "SUCCESS") {
                navigate('/login', {replace: true});
            } else if (rspData.state === "ERROR") {
                return;
            } else {
                return;
            }
        });
    }

    return (
        <div className={common.full + ' ' + common.center + ' ' + bgChange.animation}>
            <Card title='注册' headerStyle={{margin: "auto auto"}}>
                <Form onSubmit={register} style={{width: 400}}>
                    {({formState, values, formApi}) => (
                        <>
                            <Form.Input
                                field='phone'
                                label='手机号'
                                style={{width: '100%'}}
                                placeholder='请输入您的手机号'
                                rules={[
                                    {required: true, message: '必填'},
                                    {type: 'string', message: '输入了无法识别的字符'},
                                    {validator: (rule, value) => value !== '', message: '手机号格式有误'}
                                ]}
                            />
                            <Form.Input
                                field='userName'
                                label='用户名'
                                style={{width: '100%'}}
                                placeholder='请输入您的用户名'
                                rules={[
                                    {required: true, message: '必填'},
                                    {type: 'string', message: '输入了无法识别的字符'},
                                    {validator: (rule, value) => value !== '', message: '不支持这种账户名'}
                                ]}
                            />
                            <Form.Input
                                field='password'
                                mode="password"
                                label='密码'
                                style={{width: '100%'}}
                                placeholder='请输入您的密码'
                                rules={[
                                    {required: true, message: '必填'},
                                    {type: 'string', message: '输入了无法识别的字符'},
                                    {validator: (rule, value) => value !== '', message: '不支持这种密码'}
                                ]}
                            />
                            <Form.Checkbox field='agree' noLabel>
                                我已同意在不违反法律法规的前提下使用本软件
                            </Form.Checkbox>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <p>
                                    <Link to={"/login"} style={{'text-decoration': 'none',}}>
                                        <Button theme='borderless' style={{color: 'grey',}}>登录</Button>
                                    </Link>
                                </p>
                                <Button disabled={!values.agree} htmlType='submit' type="tertiary">注册</Button>
                            </div>
                        </>
                    )}
                </Form>
            </Card>
        </div>
    );
}