import {Card, CardGroup, Rating} from '@douyinfe/semi-ui';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import common from '../../css/common.module.scss';
import bgChange from '../../css/bgChange-normal.module.scss';
import productListCss from './ProductList.module.scss'

export default function ProductList(props) {
    const {Meta} = Card;
    const navigate = useNavigate();
    const [state, setState] = useState({
        productId: -1,
    });

    const onLinkProduct = function (productId) {
        navigate('/product', {replace: true, state: {productId: productId}});
    }

    const onClickFishing = function (values) {
        onLinkProduct(1);
    }

    const onClickHelpingChildren = function (values) {
        onLinkProduct(2);
    }

    const onClickLuckyBox = function (values) {
        onLinkProduct(3);
    }

    const fetchProductListData = () => {
        // 敬请期待

        console.log("fetchProductListData called");

        setState({
            ...state,
            loading: true,
        });
    };

    // 传入第二个空数组参数是为了使 useEffect 只执行一次。否则界面在初始化时将陷入死循环
    useEffect(fetchProductListData, []);

    return (
        <div className={common.full + ' ' + common.center + ' ' + bgChange.animation}>
            <CardGroup spacing={30}>
                <Card
                    style={{width: 300, height: 480}}
                    actions={[
                        <Rating size='small' defaultValue={3}/>
                    ]}
                    headerLine={false}
                    cover={
                        <div className={productListCss.fishing} onClick={onClickFishing}/>
                    }
                >
                    <div className={common.center}>
                        <Meta
                            title="吃亏上当"
                            description="谁说一块钱你买不了吃亏，买不了上当。一块钱，愿者上钩。早买教训，早成长"
                            className={productListCss.itemDescription}
                            onClick={onClickFishing}
                        />
                        <div
                            style={{
                                'margin-left': 'auto',
                                'padding-left': '10px',
                                'font-size': '16px',
                                color: '#ed4600'
                            }}
                        >
                            ￥1
                        </div>
                    </div>
                </Card>

                <Card
                    style={{width: 300, height: 480}}
                    actions={[
                        <Rating size='small' defaultValue={5}/>
                    ]}
                    headerLine={false}
                    cover={
                        <div className={productListCss.helpingChildren} onClick={onClickHelpingChildren}/>
                    }
                >
                    <div className={common.center}>
                        <Meta
                            title="世界上最贵的东西"
                            description="聚沙成塔，滴水成泉，您的每一次行动、每一份爱心，都在改变着他们的生活"
                            className={productListCss.itemDescription}
                            onClick={onClickHelpingChildren}
                        />
                        <div
                            style={{
                                'margin-left': 'auto',
                                'padding-left': '10px',
                                'font-size': '16px',
                                color: '#ed4600'
                            }}
                        >
                            ￥1
                        </div>
                    </div>
                </Card>

                <Card
                    style={{width: 300, height: 480}}
                    actions={[
                        <Rating size='small' defaultValue={4}/>
                    ]}
                    headerLine={false}
                    cover={
                        <div className={productListCss.luckyBox} onClick={onClickLuckyBox}/>
                    }
                >
                    <div className={common.center}>
                        <Meta
                            title="幸运盲盒"
                            description="你想体验怦然心动的感觉吗"
                            className={productListCss.itemDescription}
                            onClick={onClickLuckyBox}
                        />
                        <div
                            style={{
                                'margin-left': 'auto',
                                'padding-left': '10px',
                                'font-size': '16px',
                                color: '#ed4600'
                            }}
                        >
                            ￥1
                        </div>
                    </div>
                </Card>
            </CardGroup>
        </div>
    );
}
