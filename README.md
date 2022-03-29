# 极简高并发秒杀商城

* 此代码是作者出于兴趣爱好自己编写的。转载请注明。

* 作者的邮箱：contactwangpai@163.com

---

分支 M # 版本 ` M.0.0 `（前端）、` M.0.0 `（后端）支持的功能：

1. 前后端分离，前端使用 React，后端使用 Spring Boot，它们之间通过 Nginx 进行交互。凡是涉及请求页面的，由 React 路由处理，不经由 SpringBoot，可以有效减轻后端负担
2. 支持注册、登录、显示商品列表、商品详情、购买秒杀、订单列表功能
3. 支持对用户每个请求之前的身份校验以及保持用户登录状态
4. 使用 MySQL 保存用户的注册信息、订单、商品列表等
5. 使用 Redis 缓存热点数据、实现分布式锁
6. 使用 RabbitMQ 对用户秒杀请求进行削峰处理
7. 提供柔和自动渐变的背景颜色。但当用户进入秒杀界面时，背景颜色会变化得很快

---

# 版本 M.0.0 运行效果图

## 登录和注册

![如果图片不能显示，请尝试在电脑端访问](https://img-blog.csdnimg.cn/625811407cd04332a7f908607fbf3bed.gif#pic_center)

## 商品界面

![如果图片不能显示，请尝试用在电脑端访问](https://img-blog.csdnimg.cn/4e2d71412ea94d75aea3ae262c479424.gif#pic_center)

## 购买界面

![如果图片不能显示，请尝试用在电脑端访问](https://img-blog.csdnimg.cn/e6ba4854ec814f19a9509062e02807b5.gif#pic_center)

## 订单界面

![如果图片不能显示，请尝试用在电脑端访问](https://img-blog.csdnimg.cn/e7b454c7282c49a7ab6ad9160d9af011.gif#pic_center)

# 使用指南

* 本项目的前端代码需要使用 NPM 打包后，部署在服务端的 Nginx 中，并在 Nginx 中配置前端路由转发至后端。

* 本项目的后端代码需要事先在服务端安装如下环境：

  * MySQL
  * Redis
  * RabbitMQ
  * Java
  * Maven

  然后将 MySQL、Redis、RabbitMQ 中的账户密码等配置更新在 Spring Boot 的 `application.properties` 中。

# 技术内幕

<p align="right">——2022年3月29日</p>

## 总括

&emsp;&emsp;本项目是一款前后端分离的极简高并发秒杀商城项目。

---

&emsp;&emsp;前端使用 React、Semi Design 编写，其中，凡是涉及与数据库无关的静态页面的请求，均是由 React 路由来完成跳转，而不涉及对后端的请求依赖。前端使用的全是函数式组件（React Hooks），组件底层使用的是最近兴起的 Semi Design，也有部分使用的是 HTML、React 的原生组件。对后端发出的异步请求使用的是 Axios。

&emsp;&emsp;当用户浏览商品时，屏幕的背景颜色会发生柔和渐变。但当用户进入秒杀界面时，背景颜色会变化得很快。

---

&emsp;&emsp;后端使用 Spring Boot 内置 Tomcat 来接收来自前端的请求，其中，这些来自前端的请求是通过 Nginx 反向代理传入 Spring Boot 中的。每当用户登录时，后端会将用户信息缓存至 Redis，然后向前端反馈一个 Cookie 来记录本次的 Session。每当用户进入必须要先登录才能进入的界面时，后端会通过 Spring Boot 拦截器检查用户的 Session，如果 Session 存在且有效，后续的操作才能进行。

&emsp;&emsp;对于秒杀请求，后端会为本次请求生成一个 ID，存入 Redis 中，并将本次请求推入 RabbitMQ 中，然后将此 ID 反馈给前端。前端在得到此反馈 ID 后，会定期询问秒杀结果，直到查询结果已落定。请求在 RabbitMQ 中秒杀成功，会将结果写入 Redis，便于前端快速查询。此外，后端还会将其它各种热点数据写进 Redis 中，如商品的秒杀结束状态、商品的剩余数量等。

---

