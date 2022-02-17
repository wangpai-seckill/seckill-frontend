import React, {useContext, useEffect, useState} from "react";
import {Avatar, Button, Card, List, Spin, Toast} from '@douyinfe/semi-ui';
import {Link} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import {UserContext} from "../../context/UserContext";

import common from '../../css/common.module.scss';
import bgChange from '../../css/bgChange-normal.module.scss';
import orderListCss from './OrderList.module.scss'

export default function OrderList(props) {
    const {user, setUser} = useContext(UserContext);

    console.log('OrderList init');

    const [state, setState] = useState({
        userName: 'XXX',
        loading: false,
        hasMore: true,

        orderList: [],
        pageOrder: 1, // 会在界面中动态变化的量只能置入 state 中声明，而不能置于全局中声明，否则将每次被重置
        pageUnit: 10,
    });

    const getOrderList = () => {
        setState({
            ...state,
            loading: true,
        });

        var orderNum = state.pageOrder * state.pageUnit;
        return axios({
            method: "post",
            url: `/backend/deal/dealList/${orderNum}`,
        }).then((rsp) => {
            const rspData = rsp.data;

            Toast.info(rspData.msg);

            return new Promise((resolve, reject) => {
                if (rspData.state === "SUCCESS") {
                    setState({
                        ...state,
                        loading: false,
                        orderList: rspData.data,
                        pageOrder: state.pageOrder + 1,
                    });

                    resolve();
                } else {
                    reject(rspData);
                }
            });
        });
    }

    // 传入第二个空数组参数是为了使 useEffect 只执行一次。否则界面在初始化时将陷入死循环
    useEffect(getOrderList, []);

    return (
        <div className={common.full + ' ' + common.center + ' ' + bgChange.animation}>
            <Card
                style={{width: 600, height: 650}}
                bordered={false}
                headerLine={true}
                title={
                    <div className={orderListCss.productTitle}>
                        <div>
                            <Link to={"/productList"} style={{'text-decoration': 'none',}}>
                                <Button theme='borderless'>⇦</Button>
                            </Link>
                        </div>

                        <div style={{
                            'font-size': '16px',
                            'font-weight': 'bold',
                        }}>
                            订单列表
                        </div>

                        <div>
                            <Link to={""} style={{'text-decoration': 'none',}}>
                                <Button theme='borderless'>↻</Button>
                            </Link>
                        </div>
                    </div>
                }
            >
                {/* 此 div 不加，滑条到底时将不会触发自动加载更多条目 */}
                <div style={{
                    // 此 height 不加或值太大，将永久不会出现滑条
                    height: 500,
                    // 此 overflow 不加，将永久不会出现滑条
                    overflow: 'auto',
                }}>
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        threshold={20}
                        // 设置当 hasMore 为 true 时，将触发的函数
                        loadMore={getOrderList}
                        // 是否加载更多的条目
                        hasMore={!state.loading && state.hasMore}
                        useWindow={false}
                    >
                        <List
                            // 设置在加载完当前所有的条目时，还会在底部追加的组件
                            loadMore={(<Spin spinning={state.loading}/>)}
                            dataSource={state.orderList}
                            renderItem={orderData => (
                                <List.Item
                                    main={
                                        <Card
                                            style={{width: 480}}
                                            bodyStyle={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <div className={common.center}>
                                                <Avatar
                                                    className={orderListCss.productImg}
                                                    size="large"
                                                    src={"data:image/png;base64," + orderData.productImage}
                                                />
                                                <div className={orderListCss.orderInfo}>
                                                    <dl>
                                                        <dt>成交价：</dt>
                                                        <dd>{`￥${orderData.productPrice}`}</dd>
                                                    </dl>
                                                    <dl>
                                                        <dt>创建时间：</dt>
                                                        <dd>{orderData.purchaseTime}</dd>
                                                    </dl>
                                                    <dl>
                                                        <dt>订单号：</dt>
                                                        <dd>{orderData.orderId}</dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </Card>
                                    }
                                />
                            )}
                        />
                    </InfiniteScroll>
                </div>
            </Card>
        </div>
    );
}