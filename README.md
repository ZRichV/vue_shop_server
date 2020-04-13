# vue_shop_server

# 1. API 接口文档

## 1.1. API V1 接口说明

- 接口基准地址：`http://127.0.0.1:3000/api/shop/`
- 服务端已开启 CORS 跨域支持
- API V1 认证统一使用 Token 认证
- 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
- 使用 HTTP Status Code 标识状态
- 数据返回格式统一使用 JSON

### 1.1.1. 支持的请求方法

- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。
- HEAD：获取资源的元数据。
- OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。

### 1.1.2. 通用返回状态说明

| *状态码* | *含义*                | *说明*                                              |
| -------- | --------------------- | --------------------------------------------------- |
| 200      | OK                    | 请求成功                                            |
| 201      | CREATED               | 创建成功                                            |
| 204      | DELETED               | 删除成功                                            |
| 400      | BAD REQUEST           | 请求的地址不存在或者包含不支持的参数                |
| 401      | UNAUTHORIZED          | 未授权                                              |
| 403      | FORBIDDEN             | 被禁止访问                                          |
| 404      | NOT FOUND             | 请求的资源不存在                                    |
| 422      | Unprocesable entity   | [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误 |
| 500      | INTERNAL SERVER ERROR | 内部错误                                            |
|          |                       |                                                     |

------

## 1.2. 登录

### 1.2.1. 登录验证接口

- 请求路径：login
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 备注     |
| -------- | -------- | -------- |
| username | 用户名   | 不能为空 |
| password | 密码     | 不能为空 |

- 响应参数

| 参数名   | 参数说明    | 备注            |
| -------- | ----------- | --------------- |
| id       | 用户 ID     |                 |
| rid      | 用户角色 ID |                 |
| username | 用户名      |                 |
| mobile   | 手机号      |                 |
| email    | 邮箱        |                 |
| token    | 令牌        | 基于 jwt 的令牌 |

- 响应数据

```json
{
    "data": {
        "id": 500,
        "rid": 0,
        "username": "admin",
        "mobile": "123",
        "email": "123@qq.com",
        "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE1MTI1NDQyOTksImV4cCI6MTUxMjYzMDY5OX0.eGrsrvwHm-tPsO9r_pxHIQ5i5L1kX9RX444uwnRGaIM"
    },
    "meta": {
        "msg": "登录成功",
        "status": 200
    }
}
```


### 1.3 获取左侧菜单

- 请求路径：menus
- 请求方法：get
- 响应数据

```json
{
    "data": [
        {
            "id": 125,
            "authName": "用户管理",
            "path": "users",
            "children": [
                {
                    "id": 110,
                    "authName": "用户列表",
                    "path": "users",
                    "children": [],
                    "order": null
                }
            ],
            "order": 1
        },
        {
            "id": 103,
            "authName": "权限管理",
            "path": "rights",
            "children": [
                {
                    "id": 111,
                    "authName": "角色列表",
                    "path": "roles",
                    "children": [],
                    "order": null
                },
                {
                    "id": 112,
                    "authName": "权限列表",
                    "path": "rights",
                    "children": [],
                    "order": null
                }
            ],
            "order": 2
        },
        {
            "id": 101,
            "authName": "商品管理",
            "path": "goods",
            "children": [
                {
                    "id": 104,
                    "authName": "商品列表",
                    "path": "goods",
                    "children": [],
                    "order": 1
                },
                {
                    "id": 115,
                    "authName": "分类参数",
                    "path": "params",
                    "children": [],
                    "order": 2
                },
                {
                    "id": 121,
                    "authName": "商品分类",
                    "path": "categories",
                    "children": [],
                    "order": 3
                }
            ],
            "order": 3
        },
        {
            "id": 102,
            "authName": "订单管理",
            "path": "orders",
            "children": [
                {
                    "id": 107,
                    "authName": "订单列表",
                    "path": "orders",
                    "children": [],
                    "order": null
                }
            ],
            "order": 4
        },
        {
            "id": 145,
            "authName": "数据统计",
            "path": "reports",
            "children": [
                {
                    "id": 146,
                    "authName": "数据报表",
                    "path": "reports",
                    "children": [],
                    "order": null
                }
            ],
            "order": 5
        }
    ],
    "meta": {
        "msg": "获取菜单列表成功",
        "status": 200
    }
}
```

