import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Button, Card, InputNumber, Rating, Toast} from '@douyinfe/semi-ui';
import axios from "axios";
import {UserContext} from "../../context/UserContext";

import common from '../../css/common.module.scss';
import bgChange from '../../css/bgChange-fast.module.scss';
import productCss from "./Product.module.scss";

export default function Product(props) {
    const {Meta} = Card;
    const navigate = useNavigate();
    const location = useLocation();
    const {user, setUser} = useContext(UserContext);
    const [state, setState] = useState({
        productId: -1,
        purchaseQuantity: 1,
        productTitle: null,
        productDescription: null,
        productPrice: null,
        startTime: null,
        endTime: null,
        inventoryQuantity: null,

        loading: true,
        imgUrl: null,
        requestId: null,
    });

    const onBuy = () => {
        axios({
            method: "post",
            url: `/backend/seckill/${location.state.productId}`,
        }).then((rsp) => {
            const rspData = rsp.data;
            const requestId = rspData.data;

            Toast.info(rspData.msg);

            if (rspData.state === "SUCCESS") {
                setState({
                    ...state,
                    requestId: requestId,
                })

                seckillResult(requestId);
            } else if (rspData.state === "ERROR") {
                return;
            } else {
                return;
            }
        });
    }

    /**
     * 异步延时函数。使用时需要在 async 函数中左加 await 来实现阻塞延时
     *
     * @param seconds 延时数，单位为秒
     * @since 2022-3-5
     */
    const asyncDelay = (seconds) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, seconds * 1000);
        })
    }

    const seckillResult = async (requestId) => {
        let settled = false;

        while (!settled) {
            const promise = getSeckillResult(requestId);
            // 阻塞的请求
            await promise.then(
                () => {
                    // 说明查询结果已确定，购买成功了
                    settled = true;
                    navigate('/orderList', {replace: true});
                    return Promise.resolve();
                },
                (rspData) => {
                    if (rspData.state === "ERROR") {
                        // 如果后端返回 "ERROR"，说明查询结果已确定，购买失败了
                        settled = true;
                    }

                    // 其它情况下，说明结果未定

                    return Promise.resolve();
                }
            ).then(() => asyncDelay(1), () => asyncDelay(1)); // 阻塞延时 1 秒
        }
    }

    /**
     * @return 如果购买成功，返回的期约状态为解决，其它情况将为拒绝。
     * 当返回的期约被设置为拒绝时，会把后端返回的原始数据也传入被拒绝的期约中
     * @since 2022-3-5
     */
    const getSeckillResult = (requestId) => {
        return axios({
            method: "post",
            url: `/backend/seckill/result/${requestId}`,
        }).then((rsp) => {
            const rspData = rsp.data;

            Toast.info(rspData.msg);

            return new Promise((resolve, reject) => {
                if (rspData.state === "SUCCESS") {
                    resolve();
                } else {
                    reject(rspData);
                }
            });
        });
    }

    const getProductData = () => {
        // 此 setState 函数的更新不会及时，本函数后续代码不能使用 state 中的字段作为右值
        setState({
            ...state,
            productId: location.state.productId,
            loading: true,
        });

        return axios({
            method: "post",
            url: `/backend/product/${location.state.productId}/`,
        }).then((rsp) => {
            const rspData = rsp.data;

            if (rspData.state === "SUCCESS") {
                Toast.info('获取商品信息成功');
            } else if (rspData.state === "ERROR") {
                Toast.info('获取商品信息失败');
                return;
            } else {
                Toast.info('发生了未知错误');
                return;
            }

            const productData = rspData.data;
            const imgUrl = "data:image/png;base64," + productData.image;
            setState({
                ...state,
                productTitle: productData.title,
                productDescription: productData.description,
                productPrice: productData.price,
                startTime: productData.startTime,
                endTime: productData.endTime,
                inventoryQuantity: productData.inventoryQuantity,

                imgUrl: imgUrl,
                loading: false,
            });
        });
    };

    // 传入第二个空数组参数是为了使 useEffect 只执行一次。否则界面在初始化时将陷入死循环
    useEffect(getProductData, []);

    return (
        <div className={common.full + ' ' + common.center + ' ' + bgChange.animation}>
            <Card
                bordered={false}
                headerLine={true}
                title={
                    <div className={productCss.productTitle}>
                        <div>
                            <Link to={"/productList"} style={{'text-decoration': 'none',}}>
                                <Button theme='borderless'>⇦</Button>
                            </Link>
                        </div>

                        <div style={{
                            'font-size': '16px',
                            'font-weight': 'bold',
                        }}>
                            {state.productTitle}
                        </div>

                        <div>
                            <Link to={""} style={{'text-decoration': 'none',}}>
                                <Button theme='borderless'>↻</Button>
                            </Link>
                        </div>

                    </div>
                }
            >
                <div className={common.center}>
                    <Card
                        style={{width: 300}}
                        actions={[
                            <Rating size='small' defaultValue={3}/>
                        ]}
                        headerLine={false}
                        cover={
                            <img className={productCss.productImg} src={state.imgUrl}/>
                        }
                    >
                        <div className={common.center + ' ' + productCss.dotList}>
                            <span className={'dot'} style={{background: '#27ae60'}}/>
                            <span className={'dot'} style={{background: '#3498db'}}/>
                            <span className={'dot'} style={{background: '#9b59b6'}}/>
                        </div>
                        <div className={common.center}>
                            <Meta
                                style={{'text-align': 'left'}}
                                title={state.productTitle}
                                description={state.productDescription}
                            />
                            <div
                                style={{
                                    'margin-left': 'auto',
                                    'padding-left': '10px',
                                    'font-size': '16px',
                                    color: '#ed4600'
                                }}
                            >
                                {`￥${state.productPrice}`}
                            </div>
                        </div>
                    </Card>

                    <Card
                        style={{width: 400}}
                        bordered={false}
                        headerLine={false}
                    >
                        <div className={productCss.purchaseInfo}>
                            <dl>
                                <dt>秒杀开始时间：</dt>
                                <dd>{state.startTime}</dd>
                            </dl>
                            <dl>
                                <dt>秒杀结束时间：</dt>
                                <dd>{state.endTime}</dd>
                            </dl>
                            <dl>
                                <dt>秒杀价：</dt>
                                <dd style={{'color': 'red'}}>￥1</dd>
                            </dl>
                            <dl>
                                <dt>库存数量：</dt>
                                <dd>{state.inventoryQuantity}</dd>
                            </dl>

                            <br/>
                            <br/>
                            <br/>
                            <br/>

                            <dl>
                                <dt>
                                    <InputNumber
                                        formatter={value => `${value}`.replace(/\D/g, '')}
                                        onNumberChange={number => console.log(number)}
                                        min={1}
                                        max={Number.MAX_SAFE_INTEGER}
                                        defaultValue={1}
                                        style={{width: '70px'}}
                                        onChange={(value) => setState({...state, purchaseQuantity: value})}
                                    />
                                </dt>
                                <dd>
                                    <Button
                                        theme='solid'
                                        style={{
                                            width: '100px',
                                            height: '40px',
                                            background: 'red',
                                        }}
                                        onClick={onBuy}
                                    >
                                        立即购买
                                    </Button>
                                </dd>
                            </dl>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    );
}