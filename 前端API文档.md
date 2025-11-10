# 加密货币交易平台 - 前端API文档

## 一、用户认证相关API

### 1. 用户登录

**接口名称**：用户登录接口

**请求方法**：POST

**请求URL**：`/api/auth/login`

**请求参数**：
```json
{
  "email": "string", // 用户邮箱，必填
  "password": "string", // 用户密码，必填
  "rememberMe": "boolean" // 是否记住登录状态，选填，默认false
}
```

**响应格式**：
- 成功响应：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string", // JWT令牌
    "userInfo": {
      "id": "string",
      "email": "string",
      "nickname": "string",
      "avatar": "string",
      "createTime": "string",
      "lastLoginTime": "string",
      "membership": {
        "level": "string",
        "expireTime": "string"
      }
    }
  }
}
```
- 失败响应：
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 2. 用户注册

**接口名称**：用户注册接口

**请求方法**：POST

**请求URL**：`/api/auth/register`

**请求参数**：
```json
{
  "email": "string", // 用户邮箱，必填
  "password": "string", // 用户密码，必填，长度6-20位
  "confirmPassword": "string", // 确认密码，必填，需与password一致
  "agreeTerms": "boolean" // 是否同意服务条款和隐私政策，必填，必须为true
}
```

**响应格式**：
- 成功响应：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "string"
  }
}
```
- 失败响应：
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 3. 忘记密码

**接口名称**：忘记密码接口

**请求方法**：POST

**请求URL**：`/api/auth/forgot-password`

**请求参数**：
```json
{
  "email": "string" // 用户注册邮箱，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "重置密码链接已发送至您的邮箱",
  "data": null
}
```

### 4. 第三方登录

**接口名称**：第三方登录接口

**请求方法**：GET

**请求URL**：`/api/auth/oauth/{provider}`

**路径参数**：
- `provider`: 第三方平台标识，可选值：google, facebook, twitter

**响应**：重定向到第三方授权页面

### 5. 第三方登录回调

**接口名称**：第三方登录回调接口

**请求方法**：GET

**请求URL**：`/api/auth/oauth/{provider}/callback`

**路径参数**：
- `provider`: 第三方平台标识，可选值：google, facebook, twitter

**查询参数**：由第三方平台提供的回调参数

**响应格式**：同登录成功响应，返回JWT令牌和用户信息

## 二、工单系统相关API

### 1. 获取工单列表

**接口名称**：获取工单列表接口

**请求方法**：GET

**请求URL**：`/api/tickets`

**请求参数**：
- 查询参数：
  - `status`: 工单状态，可选值：open(待处理), pending(处理中), resolved(已解决), closed(已关闭)，不填则获取所有状态
  - `page`: 当前页码，默认1
  - `pageSize`: 每页条数，默认10

**响应格式**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "string", // 工单ID
        "ticketNumber": "string", // 工单编号
        "title": "string", // 工单标题
        "type": "string", // 问题类型
        "status": "string", // 工单状态
        "preview": "string", // 工单内容预览
        "createTime": "string", // 提交时间
        "lastUpdateTime": "string", // 最后更新时间
        "closeTime": "string" // 关闭时间（仅已关闭工单有）
      }
    ],
    "total": 0, // 总条数
    "page": 0, // 当前页码
    "pageSize": 0 // 每页条数
  }
}
```

### 2. 获取工单详情

**接口名称**：获取工单详情接口

**请求方法**：GET

**请求URL**：`/api/tickets/{ticketId}`

**路径参数**：
- `ticketId`: 工单ID，必填

**响应格式**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "ticketNumber": "string",
    "title": "string",
    "type": "string",
    "status": "string",
    "description": "string", // 工单详细描述
    "createTime": "string",
    "lastUpdateTime": "string",
    "closeTime": "string",
    "attachments": [ // 附件列表
      {
        "id": "string",
        "name": "string",
        "url": "string",
        "size": 0,
        "type": "string"
      }
    ],
    "replies": [ // 回复列表
      {
        "id": "string",
        "content": "string",
        "sender": "string", // 用户或客服
        "senderId": "string",
        "createTime": "string"
      }
    ]
  }
}
```

### 3. 新建工单

**接口名称**：新建工单接口

**请求方法**：POST

**请求URL**：`/api/tickets`

**请求参数**：
- Content-Type: multipart/form-data
```
{
  "type": "string", // 问题类型，必填
  "title": "string", // 工单标题，必填
  "description": "string", // 工单描述，必填
  "attachment": "file" // 附件文件，选填，支持JPG、PNG、PDF格式，最大5MB
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "工单提交成功",
  "data": {
    "ticketId": "string",
    "ticketNumber": "string"
  }
}
```

### 4. 回复工单

**接口名称**：回复工单接口

**请求方法**：POST

**请求URL**：`/api/tickets/{ticketId}/reply`

**路径参数**：
- `ticketId`: 工单ID，必填

**请求参数**：
```json
{
  "content": "string" // 回复内容，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "回复成功",
  "data": {
    "replyId": "string"
  }
}
```

### 5. 编辑工单

**接口名称**：编辑工单接口

**请求方法**：PUT

**请求URL**：`/api/tickets/{ticketId}`

**路径参数**：
- `ticketId`: 工单ID，必填

**请求参数**：
- Content-Type: multipart/form-data
```
{
  "type": "string", // 问题类型，可选
  "title": "string", // 工单标题，可选
  "description": "string", // 工单描述，可选
  "attachment": "file" // 附件文件，可选
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "编辑成功",
  "data": null
}
```

### 6. 关闭工单

**接口名称**：关闭工单接口

**请求方法**：PUT

**请求URL**：`/api/tickets/{ticketId}/close`

**路径参数**：
- `ticketId`: 工单ID，必填

**响应格式**：
```json
{
  "code": 200,
  "message": "工单已关闭",
  "data": null
}
```

### 7. 评价工单

**接口名称**：评价工单接口

**请求方法**：POST

**请求URL**：`/api/tickets/{ticketId}/rate`

**路径参数**：
- `ticketId`: 工单ID，必填

**请求参数**：
```json
{
  "rating": "number", // 评分，必填，1-5分
  "comment": "string" // 评价内容，选填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "评价成功",
  "data": null
}
```

## 三、交易所API管理相关API

### 1. 保存交易所API密钥

**接口名称**：保存交易所API密钥接口

**请求方法**：POST

**请求URL**：`/api/exchanges/{exchange}/api`

**路径参数**：
- `exchange`: 交易所名称，如 `gate`, `okx`, `yingli` 等

**请求参数**：
```json
{
  "key": "string", // API Key，必填
  "secret": "string" // API Secret，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "API密钥保存成功",
  "data": null
}
```

### 2. 获取交易所API密钥

**接口名称**：获取交易所API密钥接口

**请求方法**：GET

**请求URL**：`/api/exchanges/{exchange}/api`

**路径参数**：
- `exchange`: 交易所名称，如 `gate`, `okx`, `yingli` 等

**响应格式**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "key": "string", // 部分隐藏的API Key
    "secret": "string" // 部分隐藏的API Secret
  }
}
```

## 四、交易模板管理相关API

### 1. 获取交易模板列表

**接口名称**：获取交易模板列表接口

**请求方法**：GET

**请求URL**：`/api/templates`

**响应格式**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "currency": "string",
      "exchange": "string",
      "orderType": "string",
      "side": "string",
      "price": "string",
      "contractSize": "string",
      "leverage": "string",
      "settlementCurrency": "string",
      "tradeType": "string",
      "status": "string", // active, paused
      "createTime": "string"
    }
  ]
}
```

### 2. 获取交易模板详情

**接口名称**：获取交易模板详情接口

**请求方法**：GET

**请求URL**：`/api/templates/{id}`

**路径参数**：
- `id`: 模板ID

**响应格式**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "currency": "string",
    "exchange": "string",
    "orderType": "string",
    "side": "string",
    "price": "string",
    "contractSize": "string",
    "leverage": "string",
    "settlementCurrency": "string",
    "tradeType": "string",
    "status": "string",
    "createTime": "string",
    "updateTime": "string"
  }
}
```

### 3. 创建交易模板

**接口名称**：创建交易模板接口

**请求方法**：POST

**请求URL**：`/api/templates`

**请求参数**：
```json
{
  "name": "string", // 模板名称，必填
  "currency": "string", // 交易币种，必填
  "exchange": "string", // 交易所，必填
  "orderType": "string", // 订单类型：limit, market，必填
  "side": "string", // 交易方向：long, short，必填
  "price": "string", // 价格（限价单），选填
  "contractSize": "string", // 交易手数，必填
  "leverage": "string", // 杠杆倍数，必填
  "settlementCurrency": "string", // 结算货币，必填
  "tradeType": "string" // 交易类型：contract, spot, option，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "模板创建成功",
  "data": {
    "templateId": "string"
  }
}
```

### 4. 更新交易模板

**接口名称**：更新交易模板接口

**请求方法**：PUT

**请求URL**：`/api/templates/{id}`

**路径参数**：
- `id`: 模板ID

**请求参数**：
```json
{
  "name": "string", // 可选
  "currency": "string", // 可选
  "exchange": "string", // 可选
  "orderType": "string", // 可选
  "side": "string", // 可选
  "price": "string", // 可选
  "contractSize": "string", // 可选
  "leverage": "string", // 可选
  "settlementCurrency": "string", // 可选
  "tradeType": "string" // 可选
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "模板更新成功",
  "data": null
}
```

### 5. 删除交易模板

**接口名称**：删除交易模板接口

**请求方法**：DELETE

**请求URL**：`/api/templates/{id}`

**路径参数**：
- `id`: 模板ID

**响应格式**：
```json
{
  "code": 200,
  "message": "模板删除成功",
  "data": null
}
```

### 6. 更新模板状态

**接口名称**：更新模板状态接口

**请求方法**：POST

**请求URL**：`/api/templates/{id}/status`

**路径参数**：
- `id`: 模板ID

**请求参数**：
```json
{
  "status": "string" // active, paused，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": null
}
```

## 五、交易订单生成相关API

### 1. 生成交易订单

**接口名称**：生成交易订单接口

**请求方法**：POST

**请求URL**：`/api/orders/generate`

**请求参数**：
```json
{
  "exchange": "string", // 交易所，必填
  "currency": "string", // 交易币种，必填
  "orderType": "string", // 订单类型，必填
  "side": "string", // 交易方向，必填
  "price": "string", // 价格（限价单），选填
  "contractSize": "string", // 交易手数，必填
  "leverage": "string", // 杠杆倍数，必填
  "settlementCurrency": "string", // 结算货币，必填
  "tradeType": "string" // 交易类型，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "订单生成成功",
  "data": {
    "orderJson": {}
    // 返回完整的订单JSON数据，格式根据不同交易所而变化
  }
}
```

### 2. 提交交易订单

**接口名称**：提交交易订单接口

**请求方法**：POST

**请求URL**：`/api/orders/submit`

**请求参数**：
```json
{
  "exchange": "string", // 交易所，必填
  "orderData": {}
  // 完整的订单数据，将被发送到交易所API
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "订单提交成功",
  "data": {
    "orderId": "string",
    "status": "string"
  }
}
```

## 六、会员套餐与支付相关API

### 1. 获取会员套餐列表

**接口名称**：获取会员套餐列表接口

**请求方法**：GET

**请求URL**：`/api/membership/plans`

**响应格式**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "string",
      "name": "string", // 套餐名称，如"按月付费"
      "description": "string",
      "price": "string", // 原价
      "discountPrice": "string", // 优惠价
      "duration": 0, // 持续时间（天）
      "features": ["string"], // 包含的功能
      "isPopular": false // 是否最受欢迎
    }
  ]
}
```

### 2. 创建支付订单

**接口名称**：创建支付订单接口

**请求方法**：POST

**请求URL**：`/api/payments/orders`

**请求参数**：
```json
{
  "planId": "string", // 套餐ID，必填
  "paymentMethod": "string" // 支付方式：alipay, binance，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderId": "string",
    "paymentUrl": "string", // 支付链接
    "expireTime": "string"
  }
}
```

### 3. 查询支付状态

**接口名称**：查询支付状态接口

**请求方法**：GET

**请求URL**：`/api/payments/orders/{id}/status`

**路径参数**：
- `id`: 支付订单ID

**响应格式**：
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "status": "string", // pending, paid, failed, expired
    "planId": "string",
    "amount": "string"
  }
}
```

### 4. 激活会员套餐

**接口名称**：激活会员套餐接口

**请求方法**：POST

**请求URL**：`/api/membership/activate`

**请求参数**：
```json
{
  "redeemCode": "string" // 兑换码，必填
}
```

**响应格式**：
```json
{
  "code": 200,
  "message": "激活成功",
  "data": {
    "planId": "string",
    "expireTime": "string"
  }
}
```

## 七、接口规范说明

1. **请求头**
   - 所有需要用户认证的接口，请求头中必须包含 `Authorization: Bearer {token}`
   - Content-Type 根据请求参数类型设置，表单提交为 multipart/form-data，JSON数据为 application/json

2. **响应状态码**
   - 200: 请求成功
   - 400: 请求参数错误
   - 401: 未授权，需要登录
   - 403: 权限不足
   - 404: 资源不存在
   - 500: 服务器内部错误

3. **错误处理**
   - 接口返回错误时，统一使用 `message` 字段返回详细错误信息
   - 前端根据 `code` 和 `message` 提示用户相应信息

4. **分页规范**
   - 所有列表接口均支持分页查询
   - 分页参数统一使用 `page` 和 `pageSize`
   - 分页返回数据包含 `list`、`total`、`page`、`pageSize` 字段

## 八、安全考虑

1. 所有敏感数据传输采用HTTPS加密
2. 密码存储使用bcrypt等加密算法进行哈希处理
3. API接口采用JWT令牌认证
4. 防止SQL注入、XSS等常见安全漏洞
5. 对上传文件进行类型和大小限制，防止恶意文件上传
6. 交易所API密钥必须加密存储
7. 限制敏感操作的请求频率

## 九、其他说明

1. 接口文档会根据业务需求不断更新和完善
2. 如有接口调整，会提前通知前端开发团队
3. 建议前端实现请求超时、重试机制，提高用户体验
4. 所有时间字段统一使用ISO 8601格式：YYYY-MM-DDTHH:mm:ss.SSSZ