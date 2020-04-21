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


## 1.3. 获取左侧菜单

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

## 1.4. 管理员管理（用户管理）
### 1.4.1. 获取管理员列表
- 请求路径：users
- 请求方法：get
- 请求参数

| 参数名   | 参数说明     | 备注     |
| -------- | ------------ | -------- |
| query    | 查询参数     | 可以为空 |
| pagenum  | 当前页码     | 不能为空 |
| pagesize | 每页显示条数 | 不能为空 |

- 响应参数

| 参数名    | 参数说明     | 备注 |
| --------- | ------------ | ---- |
| total     | 总记录数     |      |
| pagenum   | 当前页码     |      |
| users     | 用户数据集合 |      |

- 响应数据

```json
{
    "data": {
        "total": 4,
        "pagenum": 1,
        "users": [
            {
                "id": 500,
                "role_name": "超级管理员",
                "username": "admin",
                "create_time": 1486720211,
                "mobile": "12345678",
                "email": "adsfad@qq.com",
                "mg_state": true
            }
        ]
    },
    "meta": {
        "msg": "获取管理员列表成功",
        "status": 200
    }
}
```
### 1.4.2. 添加用户

- 请求路径：users
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 备注     |
| -------- | -------- | -------- |
| username | 用户名称 | 不能为空 |
| password | 用户密码 | 不能为空 |
| email    | 邮箱     | 可以为空 |
| mobile   | 手机号   | 可以为空 |

- 响应参数

| 参数名   | 参数说明    | 备注 |
| -------- | ----------- | ---- |
| id       | 用户 ID     |      |
| rid      | 用户角色 ID |      |
| username | 用户名      |      |
| mobile   | 手机号      |      |
| email    | 邮箱        |      |

- 响应数据

```json
{
    "data": {
        "id": 511,
        "username": "test02",
        "mobile": "12345678",
        "email": "123@qq.com",
        "role_id": -1,
        "create_time": 1586957695
    },
    "meta": {
        "msg": "创建成功",
        "status": 201
    }
}
```

### 1.4.3. 修改用户状态

- 请求路径：users/:uId/state/:type
- 请求方法：put
- 请求参数

| 参数名 | 参数说明 | 备注                                        |
| ------ | -------- | ------------------------------------------- |
| uId    | 用户 ID  | 不能为空`携带在url中`                       |
| type   | 用户状态 | 不能为空`携带在url中`，值为 true 或者 false |

- 响应数据

```json
{
    "data": {
        "id": 511,
        "rid": -1,
        "username": "test02",
        "mobile": "12345678",
        "email": "123@qq.com",
        "mg_state": 1
    },
    "meta": {
        "msg": "修改用户状态成功",
        "status": 200
    }
}
```

### 1.4.4. 根据 ID 查询用户信息

- 请求路径：users/:id
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| id     | 用户 ID  | 不能为空`携带在url中` |

- 响应参数

| 参数名  | 参数说明 | 备注 |
| ------- | -------- | ---- |
| id      | 用户 ID  |      |
| role_id | 角色 ID  |      |
| mobile  | 手机号   |      |
| email   | 邮箱     |      |

- 响应数据

```json
{
    "data": {
        "id": 512,
        "username": "test03",
        "role_id": -1,
        "mobile": "12345678",
        "email": "123@qq.com"
    },
    "meta": {
        "msg": "根据 ID 查询用户信息成功",
        "status": 200
    }
}
```

### 1.4.5. 编辑用户提交

- 请求路径：users/:id
- 请求方法：put
- 请求参数

| 参数名 | 参数说明 | 备注                        |
| ------ | -------- | --------------------------- |
| id     | 用户 id  | 不能为空 `参数是url参数:id` |
| email  | 邮箱     | 可以为空                    |
| mobile | 手机号   | 可以为空                    |

- 响应参数

| 参数名  | 参数说明 | 备注 |
| ------- | -------- | ---- |
| id      | 用户 ID  |      |
| role_id | 角色 ID  |      |
| mobile  | 手机号   |      |
| email   | 邮箱     |      |

- 响应数据

```json
/* 200表示成功，500表示失败 */
{
    "data": {
        "id": 512,
        "username": "test03",
        "role_id": -1,
        "mobile": "87654321",
        "email": "qwe@qq.com"
    },
    "meta": {
        "msg": "编辑用户提交成功",
        "status": 200
    }
}
```

### 1.4.6. 删除单个用户

- 请求路径：users/:id
- 请求方法：delete
- 请求参数

| 参数名 | 参数说明 | 备注                       |
| ------ | -------- | -------------------------- |
| id     | 用户 id  | 不能为空`参数是url参数:id` |

- 响应参数
- 响应数据

```json
{
    "data": null,
    "meta": {
        "msg": "删除成功",
        "status": 200
    }
}
```

### 1.4.7. 分配用户角色

- 请求路径：users/:id/role
- 请求方法：put
- 请求参数

| 参数名 | 参数说明 | 备注                       |
| ------ | -------- | -------------------------- |
| id     | 用户 ID  | 不能为空`参数是url参数:id` |
| rid    | 角色 id  | 不能为空`参数body参数`     |

- 响应参数

| 参数名  | 参数说明 | 备注 |
| ------- | -------- | ---- |
| id      | 用户 ID  |      |
| role_id | 角色 ID  |      |
| mobile  | 手机号   |      |
| email   | 邮箱     |      |

- 响应数据

## 1.5. 权限管理

### 1.5.1. 所有权限列表

- 请求路径：rights/:type
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注                                                         |
| ------ | -------- | ------------------------------------------------------------ |
| type   | 类型     | 值 list 或 tree , list 列表显示权限, tree 树状显示权限,`参数是url参数:type` |

- 响应参数

| 参数名   | 参数说明     | 备注 |
| -------- | ------------ | ---- |
| id       | 权限 ID      |      |
| authName | 权限说明     |      |
| level    | 权限层级     |      |
| pid      | 权限父 ID    |      |
| path     | 对应访问路径 |      |

- 响应数据 type=list/tree

## 1.6. 角色管理

### 1.6.1. 角色列表

- 请求路径：roles

- 请求方法：get

- 响应数据说明

  + 第一层为角色信息

  - 第二层开始为权限说明，权限一共有 3 层权限
  - 最后一层权限，不包含 `children` 属性

- 响应数据

```json

```

### 1.6.2. 添加角色

- 请求路径：roles
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 备注     |
| -------- | -------- | -------- |
| roleName | 角色名称 | 不能为空 |
| roleDesc | 角色描述 | 可以为空 |

- 响应参数

| 参数名   | 参数说明 | 备注 |
| -------- | -------- | ---- |
| roleId   | 角色 ID  |      |
| roleName | 角色名称 |      |
| roleDesc | 角色描述 |      |

- 响应数据

```json

```

### 1.6.3. 根据 ID 查询角色

- 请求路径：roles/:id
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| :id    | 角色 ID  | 不能为空`携带在url中` |

- 响应参数

| 参数名   | 参数说明 | 备注 |
| -------- | -------- | ---- |
| roleId   | 角色 ID  |      |
| roleName | 角色名称 |      |
| roleDesc | 角色描述 |      |

- 响应数据

```json

```

### 1.6.4. 编辑提交角色

- 请求路径：roles/:id
- 请求方法：put
- 请求参数

| 参数名   | 参数说明 | 备注                  |
| -------- | -------- | --------------------- |
| :id      | 角色 ID  | 不能为空`携带在url中` |
| roleName | 角色名称 | 不能为空              |
| roleDesc | 角色描述 | 可以为空              |

- 响应数据

```json

```

### 1.6.5. 删除角色

- 请求路径：roles/:id
- 请求方法：delete
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| :id    | 角色 ID  | 不能为空`携带在url中` |

- 响应数据

```json

```

### 1.6.6. 角色授权

- 请求路径：roles/:roleId/rights
- 请求方法：post
- 请求参数：通过 `请求体` 发送给后端

| 参数名  | 参数说明               | 备注                                                         |
| ------- | ---------------------- | ------------------------------------------------------------ |
| :roleId | 角色 ID                | 不能为空`携带在url中`                                        |
| rids    | 权限 ID 列表（字符串） | 以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点） |

- 响应数据

```json

```

### 1.6.7. 删除角色指定权限

- 请求路径：roles/:roleId/rights/:rightId

- 请求方法：delete

- 请求参数

  | 参数名   | 参数说明 | 备注                  |
  | -------- | -------- | --------------------- |
  | :roleId  | 角色 ID  | 不能为空`携带在url中` |
  | :rightId | 权限 ID  | 不能为空`携带在url中` |

- 响应数据说明 

  - 返回的data, 是当前角色下最新的权限数据

- 响应数据

  ```json
  
  ```
## 1.7. 商品分类管理

### 1.7.1. 商品分类数据列表

- 请求路径：categories
- 请求方法：get
- 请求参数

| 参数名   | 参数说明           | 备注                                                         |
| -------- | ------------------ | ------------------------------------------------------------ |
| type     | [1,2,3]            | 值：1，2，3 分别表示显示一层二层三层分类列表<br />【可选参数】如果不传递，则默认获取所有级别的分类 |
| pagenum  | 当前页码值         | 【可选参数】如果不传递，则默认获取所有分类                   |
| pagesize | 每页显示多少条数据 | 【可选参数】如果不传递，则默认获取所有分类                   |

- 响应参数

| 参数名    | 参数说明     | 备注 |
| --------- | ------------ | ---- |
| cat_id    | 分类 ID      |      |
| cat_name  | 分类名称     |      |
| cat_pid   | 分类父 ID    |      |
| cat_level | 分类当前层级 |      |

- 响应数据

```json

```

### 1.7.2. 添加分类

- 请求路径：categories
- 请求方法：post
- 请求参数

| 参数名    | 参数说明  | 备注                                                        |
| --------- | --------- | ----------------------------------------------------------- |
| cat_pid   | 分类父 ID | 不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`      |
| cat_name  | 分类名称  | 不能为空                                                    |
| cat_level | 分类层级  | 不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类 |

- 响应数据

```json

```

### 1.7.3. 根据 id 查询分类

- 请求路径：categories/:id
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| :id    | 分类 ID  | 不能为空`携带在url中` |

- 响应数据

```

```

### 1.7.4. 编辑提交分类

- 请求路径：categories/:id
- 请求方法：put
- 请求参数

| 参数名   | 参数说明 | 备注                             |
| -------- | -------- | -------------------------------- |
| :id      | 分类 ID  | 不能为空`携带在url中`            |
| cat_name | 分类名称 | 不能为空【此参数，放到请求体中】 |

- 响应数据

```

```

### 1.7.5. 删除分类

- 请求路径：categories/:id
- 请求方法：delete
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| :id    | 分类 ID  | 不能为空`携带在url中` |

- 响应数据

```

```

### 1.7.6. 参数列表

- 请求路径：categories/:id/attributes
- 请求方法：get
- 请求参数

| 参数名 | 参数说明    | 备注                                                      |
| ------ | ----------- | --------------------------------------------------------- |
| :id    | 分类 ID     | 不能为空`携带在url中`                                     |
| sel    | [only,many] | 不能为空,通过 only 或 many 来获取分类静态参数还是动态参数 |

- 响应参数

| 参数名     | 参数说明                                       | 备注 |
| ---------- | ---------------------------------------------- | ---- |
| attr_id    | 分类参数 ID                                    |      |
| attr_name  | 分类参数名称                                   |      |
| cat_id     | 分类参数所属分类                               |      |
| attr_sel   | only:输入框(唯一) many:后台下拉列表/前台单选框 |      |
| attr_write | manual:手工录入 list:从列表选择                |      |
| attr_vals  | 如果 attr_write:list,那么有值，该值以逗号分隔  |      |

- 响应数据

```

```

### 1.7.7. 添加动态参数或者静态属性

- 请求路径：categories/:id/attributes
- 请求方法：post
- 请求参数

| 参数名    | 参数说明                                   | 备注                  |
| --------- | ------------------------------------------ | --------------------- |
| :id       | 分类 ID                                    | 不能为空`携带在url中` |
| attr_name | 参数名称                                   | 不能为空              |
| attr_sel  | [only,many]                                | 不能为空              |
| attr_vals | 如果是 many 就需要填写值的选项，以逗号分隔 | 【可选参数】          |

- 响应数据



### 1.7.8. 删除参数

- 请求路径： categories/:id/attributes/:attrid
- 请求方法：delete
- 请求参数

| 参数名  | 参数说明 | 备注                  |
| ------- | -------- | --------------------- |
| :id     | 分类 ID  | 不能为空`携带在url中` |
| :attrid | 参数 ID  | 不能为空`携带在url中` |

- 响应数据



### 1.7.9. 根据 ID 查询参数

- 请求路径：categories/:id/attributes/:attrId
- 请求方法：get
- 请求参数

| 参数名    | 参数说明                                   | 备注                  |
| --------- | ------------------------------------------ | --------------------- |
| :id       | 分类 ID                                    | 不能为空`携带在url中` |
| :attrId   | 属性 ID                                    | 不能为空`携带在url中` |
| attr_sel  | [only,many]                                | 不能为空              |
| attr_vals | 如果是 many 就需要填写值的选项，以逗号分隔 |                       |

- 响应数据



### 1.7.10. 编辑提交参数

- 请求路径：categories/:id/attributes/:attrId
- 请求方法：put
- 请求参数

| 参数名    | 参数说明               | 备注                       |
| --------- | ---------------------- | -------------------------- |
| :id       | 分类 ID                | 不能为空`携带在url中`      |
| :attrId   | 属性 ID                | 不能为空`携带在url中`      |
| attr_name | 新属性的名字           | 不能为空，携带在`请求体`中 |
| attr_sel  | 属性的类型[many或only] | 不能为空，携带在`请求体`中 |
| attr_vals | 参数的属性值           | 可选参数，携带在`请求体`中 |

- 响应数据

## 1.8. 商品管理

### 1.8.1. 商品列表数据

- 请求路径：goods
- 请求方法：get
- 请求参数

| 参数名   | 参数说明     | 备注     |
| -------- | ------------ | -------- |
| query    | 查询参数     | 可以为空 |
| pagenum  | 当前页码     | 不能为空 |
| pagesize | 每页显示条数 | 不能为空 |

- 响应参数

| 参数名       | 参数说明     | 备注                                   |
| ------------ | ------------ | -------------------------------------- |
| total        | 总共商品条数 |                                        |
| pagenum      | 当前商品页数 |                                        |
| goods_id     | 商品 ID      |                                        |
| goods_name   | 商品名称     |                                        |
| goods_price  | 价格         |                                        |
| goods_number | 数量         |                                        |
| goods_weight | 重量         | 不能为空                               |
| goods_state  | 商品状态     | 商品状态 0: 未通过 1: 审核中 2: 已审核 |
| add_time     | 添加时间     |                                        |
| upd_time     | 更新时间     |                                        |
| hot_mumber   | 热销品数量   |                                        |
| is_promote   | 是否是热销品 |                                        |

- 响应数据



### 1.8.2. 添加商品

- 请求路径：goods
- 请求方法：post
- 请求参数

| 参数名          | 参数说明                                          | 备注     |
| --------------- | ------------------------------------------------- | -------- |
| goods_name      | 商品名称                                          | 不能为空 |
| goods_cat       | 以为','分割的分类列表                             | 不能为空 |
| goods_price     | 价格                                              | 不能为空 |
| goods_number    | 数量                                              | 不能为空 |
| goods_weight    | 重量                                              | 不能为空 |
| goods_introduce | 介绍                                              | 可以为空 |
| pics            | 上传的图片临时路径（对象）                        | 可以为空 |
| attrs           | 商品的参数（数组），包含 `动态参数` 和 `静态属性` | 可以为空 |

- 请求数据



- 响应参数

| 参数名       | 参数说明                   | 备注                                                         |
| ------------ | -------------------------- | ------------------------------------------------------------ |
| total        | 总共商品条数               |                                                              |
| pagenum      | 当前商品页数               |                                                              |
| goods_id     | 商品 ID                    |                                                              |
| goods_cat    | 以为','分割的分类列表      |                                                              |
| goods_name   | 商品名称                   |                                                              |
| goods_price  | 价格                       |                                                              |
| goods_number | 数量                       |                                                              |
| goods_weight | 重量                       | 不能为空                                                     |
| goods_state  | 商品状态                   | 商品状态 0: 未通过 1: 审核中 2: 已审核                       |
| add_time     | 添加时间                   |                                                              |
| upd_time     | 更新时间                   |                                                              |
| hot_mumber   | 热销品数量                 |                                                              |
| is_promote   | 是否是热销品               |                                                              |
| pics         | 上传的图片临时路径（对象） | pics_id:图片 ID,goods_id:商品 ID,pics_big:大图,pics_mid:中图,pics_sma:小图 |
| attrs        | 商品的参数（数组）         | goods_id:商品 ID,attr_value:当前商品的参数值,add_price:浮动价格,attr_vals:预定义的参数值,attr_sel:手动输入，还是单选, |

- 响应数据



### 1.8.3. 根据 ID 查询商品

- 请求路径：goods/:id
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| id     | 商品 ID  | 不能为空`携带在url中` |

- 响应参数

| 参数名       | 参数说明                   | 备注                                                         |
| ------------ | -------------------------- | ------------------------------------------------------------ |
| total        | 总共商品条数               |                                                              |
| pagenum      | 当前商品页数               |                                                              |
| goods_id     | 商品 ID                    |                                                              |
| goods_name   | 商品名称                   |                                                              |
| goods_price  | 价格                       |                                                              |
| goods_number | 数量                       |                                                              |
| goods_weight | 重量                       | 不能为空                                                     |
| goods_state  | 商品状态                   | 商品状态 0: 未通过 1: 审核中 2: 已审核                       |
| add_time     | 添加时间                   |                                                              |
| upd_time     | 更新时间                   |                                                              |
| hot_mumber   | 热销品数量                 |                                                              |
| is_promote   | 是否是热销品               |                                                              |
| pics         | 上传的图片临时路径（对象） | pics_id:图片 ID,goods_id:商品 ID,pics_big:大图,pics_mid:中图,pics_sma:小图 |
| attrs        | 商品的参数（数组）         | goods_id:商品 ID,attr_value:当前商品的参数值,add_price:浮动价格,attr_vals:预定义的参数值,attr_sel:手动输入，还是单选, |

- 响应数据



### 1.8.4. 编辑提交商品

- 请求路径：goods/:id
- 请求方法：put
- 请求参数

| 参数名          | 参数说明                   | 备注                  |
| --------------- | -------------------------- | --------------------- |
| id              | 商品 ID                    | 不能为空`携带在url中` |
| goods_name      | 商品名称                   | 不能为空              |
| goods_price     | 价格                       | 不能为空              |
| goods_number    | 数量                       | 不能为空              |
| goods_weight    | 重量                       | 不能为空              |
| goods_introduce | 介绍                       | 可以为空              |
| pics            | 上传的图片临时路径（对象） | 可以为空              |
| attrs           | 商品的参数（数组）         | 可以为空              |

- 请求数据

- 响应参数

| 参数名       | 参数说明                   | 备注                                                         |
| ------------ | -------------------------- | ------------------------------------------------------------ |
| total        | 总共商品条数               |                                                              |
| pagenum      | 当前商品页数               |                                                              |
| goods_id     | 商品 ID                    |                                                              |
| goods_name   | 商品名称                   |                                                              |
| goods_price  | 价格                       |                                                              |
| goods_number | 数量                       |                                                              |
| goods_weight | 重量                       | 不能为空                                                     |
| goods_state  | 商品状态                   | 商品状态 0: 未通过 1: 审核中 2: 已审核                       |
| add_time     | 添加时间                   |                                                              |
| upd_time     | 更新时间                   |                                                              |
| hot_mumber   | 热销品数量                 |                                                              |
| is_promote   | 是否是热销品               |                                                              |
| pics         | 上传的图片临时路径（对象） | pics_id:图片 ID,goods_id:商品 ID,pics_big:大图,pics_mid:中图,pics_sma:小图 |
| attrs        | 商品的参数（数组）         | goods_id:商品 ID,attr_value:当前商品的参数值,add_price:浮动价格,attr_vals:预定义的参数值,attr_sel:手动输入，还是单选, |

- 响应数据



### 1.8.5. 删除商品

- 请求路径：goods/:id
- 请求方法：delete
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| id     | 商品 ID  | 不能为空`携带在url中` |

- 响应数据



### 1.8.6. 同步商品图片

- 请求路径：goods/:id/pics
- 请求方法：put
- 请求参数

| 参数名 | 参数说明     | 备注                                                         |
| ------ | ------------ | ------------------------------------------------------------ |
| id     | 商品 ID      | 不能为空`携带在url中`                                        |
| pics   | 商品图片集合 | 如果有 pics_id 字段会保留该图片，如果没有 pics_id 但是有 pic 字段就会新生成图片数据 |

- 请求数据

```
;[
  { pic: 'tmp_uploads/db28f6316835836e97653b5c75e418be.png' },
  {
    pics_id: 397,
    goods_id: 145,
    pics_big: 'uploads/goodspics/big_30f08d52c551ecb447277eae232304b8',
    pics_mid: 'uploads/goodspics/mid_30f08d52c551ecb447277eae232304b8',
    pics_sma: 'uploads/goodspics/sma_30f08d52c551ecb447277eae232304b8'
  }
]
```

- 响应数据



### 1.8.7. 同步商品属性

- 请求路径：goods/:id/attributes
- 请求方法：put
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| id     | 商品 ID  | 不能为空`携带在url中` |

- 请求数据

```
;[
  {
    attr_id: 15,
    attr_value: 'ddd'
  },
  {
    attr_id: 15,
    attr_value: 'eee'
  }
]
```

- 响应数据



### 1.8.8. 商品图片处理必须安装 GraphicsMagick

- linux

```
apt-get install GraphicsMagick
```

- Mac OS X

```
brew install GraphicsMagick
```

- Windows [点击下载](https://sourceforge.net/projects/graphicsmagick/files/graphicsmagick-binaries/1.3.27/GraphicsMagick-1.3.27-Q8-win64-dll.exe/download)

## 1.9. 图片上传

- 请求路径：upload
- 请求方法：post
- 请求参数

| 参数名 | 参数说明 | 备注 |
| ------ | -------- | ---- |
| file   | 上传文件 |      |

- 响应数据



