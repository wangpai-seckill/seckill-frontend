import React from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/advance/Login";
import Registration from "../pages/advance/Registration";
import Product from "../pages/product/Product";
import ProductList from "../pages/product/ProductList";
import OrderList from "../pages/user/OrderList";

export default function SeckillRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route exact={true} path="/" element={<Home/>}/>
                <Route exact={true} path="/login" element={<Login/>}/>
                <Route exact={true} path="/registration" element={<Registration/>}/>
                <Route exact={true} path="/product" element={<Product/>}/>
                <Route exact={true} path="/productList" element={<ProductList/>}/>
                <Route exact={true} path="/orderList" element={<OrderList/>}/>
            </Routes>
        </HashRouter>

    );
}