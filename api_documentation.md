# Gate Trading Alert System 后端接口文档

## 概述
本文档详细描述了Gate Trading Alert System的后端API接口，方便前端开发人员进行对接。所有接口均使用HTTP协议，遵循RESTful设计原则。

## 基础信息
- 接口基础URL: 假设为 `http://server:port`
- 认证方式: JWT Token (在请求头或参数中传递)
- 响应格式: JSON
- 错误处理: 统一返回错误码和错误信息

## 接口分类
本文档将接口分为以下几类：
1. [认证相关接口](#认证相关接口)
2. [警报模板相关接口](#警报模板相关接口)
3. [交易所密钥管理接口](#交易所密钥管理接口)
4. [交易模板相关接口](#交易模板相关接口)
5. [订单管理接口](#订单管理接口)
6. [会员管理接口](#会员管理接口)
7. [支付相关接口](#支付相关接口)
8. [用户个人信息和通知接口](#用户个人信息和通知接口)
9. [其他接口](#其他接口)

## 认证相关接口

### 1. 发送邮箱验证码
**路径**: `/api/auth/send-verification-code`
**方法**: POST
**描述**: 向指定邮箱发送验证码，用于注册或重置密码

**请求参数**: 
```json
{
  "email": "string", // 目标邮箱地址
  "type": "string" // verification_type, 可选值: 'register' 或 'reset_password'
}
```

**响应**: 
```json
{
  "message": "验证码已发送，请查收邮件"
}
```

**错误码**: 
- 400: 邮箱格式不正确/验证码类型错误/邮箱已被注册
- 500: 发送验证码失败

### 2. 验证邮箱验证码
**路径**: `/api/auth/verify-code`
**方法**: POST
**描述**: 验证邮箱验证码是否正确

**请求参数**: 
```json
{
  "email": "string", // 邮箱地址
  "code": "string", // 验证码
  "type": "string" // verification_type, 可选值: 'register' 或 'reset_password'
}
```

**响应**: 
```json
{
  "message": "验证码验证成功",
  "verification_token": "string" // 验证令牌，用于后续注册或重置密码
}
```

**错误码**: 
- 400: 验证码错误或已过期/邮箱地址不匹配
- 500: 验证失败

### 3. 用户注册
**路径**: `/api/auth/register`
**方法**: POST
**描述**: 用户注册接口

**请求参数**: 
```json
{
  "email": "string", // 邮箱地址
  "username": "string", // 用户名
  "password": "string", // 密码
  "verification_token": "string" // 验证令牌（通过验证邮箱验证码获取）
}
```

**响应**: 
```json
{
  "message": "注册成功",
  "user_id": "string", // 用户ID
  "token": "string" // JWT Token
}
```

**错误码**: 
- 400: 邮箱已被注册/用户名已存在/验证令牌无效
- 500: 注册失败

### 4. 用户登录
**路径**: `/api/auth/login`
**方法**: POST
**描述**: 用户登录接口

**请求参数**: 
```json
{
  "email": "string", // 邮箱地址
  "password": "string" // 密码
}
```

**响应**: 
```json
{
  "message": "登录成功",
  "user_id": "string", // 用户ID
  "token": "string", // JWT Token
  "token_type": "Bearer",
  "expires_in": integer // Token过期时间（秒）
}
```

**错误码**: 
- 400: 邮箱或密码错误
- 500: 登录失败

### 5. 用户登出
**路径**: `/api/auth/logout`
**方法**: POST
**描述**: 用户登出接口

**请求参数**: 
```json
{
  "token": "string" // JWT Token
}
```

**响应**: 
```json
{
  "message": "登出成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 登出失败

### 6. 获取当前用户信息
**路径**: `/api/auth/me`
**方法**: GET
**描述**: 获取当前登录用户的信息

**请求参数**: 
- `token` (query parameter): JWT Token

**响应**: 
```json
{
  "user_id": "string", // 用户ID
  "username": "string", // 用户名
  "email": "string", // 邮箱地址
  "created_at": "string", // 创建时间
  "updated_at": "string" // 更新时间
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取用户信息失败

### 7. 忘记密码
**路径**: `/api/auth/forgot-password`
**方法**: POST
**描述**: 忘记密码，发送重置密码邮件

**请求参数**: 
```json
{
  "email": "string" // 注册时使用的邮箱地址
}
```

**响应**: 
```json
{
  "message": "重置密码邮件已发送，请查收"
}
```

**错误码**: 
- 404: 该邮箱未注册
- 500: 发送邮件失败

### 8. 重置密码
**路径**: `/api/auth/reset-password`
**方法**: POST
**描述**: 重置用户密码

**请求参数**: 
```json
{
  "email": "string", // 邮箱地址
  "new_password": "string", // 新密码
  "verification_token": "string" // 验证令牌（通过验证邮箱验证码获取）
}
```

**响应**: 
```json
{
  "message": "密码重置成功"
}
```

**错误码**: 
- 400: 验证令牌无效/密码格式不符合要求
- 500: 重置密码失败

## 警报模板相关接口

### 9. 创建警报模板
**路径**: `/api/alerts/create`
**方法**: POST
**描述**: 创建新的警报模板

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_name": "string", // 模板名称
  "alert_type": "string", // 警报类型
  "condition": "string", // 触发条件
  "threshold": number, // 阈值
  "exchange": "string", // 交易所
  "symbol": "string", // 交易对
  "time_frame": "string" // 时间周期
}
```

**响应**: 
```json
{
  "message": "警报模板创建成功",
  "template_id": "string" // 模板ID
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 创建失败

### 10. 获取用户的警报模板
**路径**: `/api/alerts/user`
**方法**: GET
**描述**: 获取当前用户创建的所有警报模板

**请求参数**: 
- `token` (query parameter): JWT Token

**响应**: 
```json
{
  "templates": [
    {
      "template_id": "string", // 模板ID
      "template_name": "string", // 模板名称
      "alert_type": "string", // 警报类型
      "condition": "string", // 触发条件
      "threshold": number, // 阈值
      "exchange": "string", // 交易所
      "symbol": "string", // 交易对
      "time_frame": "string", // 时间周期
      "created_at": "string", // 创建时间
      "updated_at": "string" // 更新时间
    }
  ]
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 11. 删除警报模板
**路径**: `/api/alerts/delete`
**方法**: POST
**描述**: 删除指定的警报模板

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_id": "string" // 模板ID
}
```

**响应**: 
```json
{
  "message": "警报模板删除成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 模板不存在
- 500: 删除失败

## 交易所密钥管理接口

### 12. 创建交易所密钥
**路径**: `/api/exchange-keys/create`
**方法**: POST
**描述**: 为用户添加交易所API密钥

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "exchange_name": "string", // 交易所名称
  "api_key": "string", // API Key
  "api_secret": "string", // API Secret
  "is_main": boolean // 是否为主密钥
}
```

**响应**: 
```json
{
  "message": "交易所密钥创建成功",
  "key_id": "string" // 密钥ID
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 创建失败

### 13. 获取用户的交易所密钥列表
**路径**: `/api/exchange-keys`
**方法**: GET
**描述**: 获取用户已添加的所有交易所密钥

**请求参数**: 
- `token` (query parameter): JWT Token

**响应**: 
```json
{
  "keys": [
    {
      "key_id": "string", // 密钥ID
      "exchange_name": "string", // 交易所名称
      "api_key": "string", // 部分隐藏的API Key
      "is_main": boolean, // 是否为主密钥
      "created_at": "string", // 创建时间
      "updated_at": "string" // 更新时间
    }
  ]
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 14. 更新交易所密钥
**路径**: `/api/exchange-keys/update`
**方法**: POST
**描述**: 更新指定的交易所密钥

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "key_id": "string", // 密钥ID
  "api_key": "string", // 新的API Key (可选)
  "api_secret": "string", // 新的API Secret (可选)
  "is_main": boolean // 是否为主密钥 (可选)
}
```

**响应**: 
```json
{
  "message": "交易所密钥更新成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 密钥不存在
- 500: 更新失败

### 15. 删除交易所密钥
**路径**: `/api/exchange-keys/delete`
**方法**: POST
**描述**: 删除指定的交易所密钥

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "key_id": "string" // 密钥ID
}
```

**响应**: 
```json
{
  "message": "交易所密钥删除成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 密钥不存在
- 500: 删除失败

## 交易模板相关接口

### 16. 获取交易模板列表
**路径**: `/api/templates`
**方法**: GET
**描述**: 获取交易模板列表，支持分页和筛选

**请求参数**: 
- `token` (query parameter): JWT Token
- `page` (query parameter): 页码，默认1
- `page_size` (query parameter): 每页数量，默认20
- `is_public` (query parameter, optional): 是否为公开模板

**响应**: 
```json
{
  "data": [
    {
      "template_id": "string", // 模板ID
      "template_name": "string", // 模板名称
      "strategy_type": "string", // 策略类型
      "exchange": "string", // 交易所
      "symbol": "string", // 交易对
      "time_frame": "string", // 时间周期
      "parameters": {"..."}, // 策略参数
      "is_public": boolean, // 是否公开
      "is_active": boolean, // 是否活动
      "created_at": "string", // 创建时间
      "updated_at": "string" // 更新时间
    }
  ],
  "page": integer, // 当前页码
  "page_size": integer, // 每页数量
  "total": integer, // 总数量
  "total_pages": integer // 总页数
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 17. 获取交易模板详情
**路径**: `/api/templates/{template_id}`
**方法**: GET
**描述**: 获取指定交易模板的详细信息

**请求参数**: 
- `token` (query parameter): JWT Token
- `template_id` (path parameter): 模板ID

**响应**: 
```json
{
  "template_id": "string", // 模板ID
  "template_name": "string", // 模板名称
  "strategy_type": "string", // 策略类型
  "exchange": "string", // 交易所
  "symbol": "string", // 交易对
  "time_frame": "string", // 时间周期
  "parameters": {"..."}, // 策略参数
  "is_public": boolean, // 是否公开
  "is_active": boolean, // 是否活动
  "created_at": "string", // 创建时间
  "updated_at": "string" // 更新时间
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 模板不存在
- 500: 获取失败

### 18. 创建交易模板
**路径**: `/api/templates/create`
**方法**: POST
**描述**: 创建新的交易模板

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_name": "string", // 模板名称
  "strategy_type": "string", // 策略类型
  "exchange": "string", // 交易所
  "symbol": "string", // 交易对
  "time_frame": "string", // 时间周期
  "parameters": {"..."}, // 策略参数
  "is_public": boolean // 是否公开
}
```

**响应**: 
```json
{
  "message": "交易模板创建成功",
  "template_id": "string" // 模板ID
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 创建失败

### 19. 更新交易模板
**路径**: `/api/templates/update`
**方法**: POST
**描述**: 更新指定的交易模板

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_id": "string", // 模板ID
  "template_name": "string", // 模板名称 (可选)
  "strategy_type": "string", // 策略类型 (可选)
  "exchange": "string", // 交易所 (可选)
  "symbol": "string", // 交易对 (可选)
  "time_frame": "string", // 时间周期 (可选)
  "parameters": {"..."}, // 策略参数 (可选)
  "is_public": boolean // 是否公开 (可选)
}
```

**响应**: 
```json
{
  "message": "交易模板更新成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 模板不存在
- 500: 更新失败

### 20. 删除交易模板
**路径**: `/api/templates/delete`
**方法**: POST
**描述**: 删除指定的交易模板

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_id": "string" // 模板ID
}
```

**响应**: 
```json
{
  "message": "交易模板删除成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 模板不存在
- 500: 删除失败

### 21. 更新交易模板的公开状态
**路径**: `/api/templates/public`
**方法**: POST
**描述**: 更新交易模板的公开/私有状态

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_id": "string", // 模板ID
  "is_public": boolean // 是否公开
}
```

**响应**: 
```json
{
  "message": "交易模板公开状态更新成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 模板不存在
- 500: 更新失败

### 22. 更新交易模板的活动状态
**路径**: `/api/templates/active`
**方法**: POST
**描述**: 更新交易模板的活动状态

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_id": "string", // 模板ID
  "is_active": boolean // 是否活动
}
```

**响应**: 
```json
{
  "message": "交易模板活动状态更新成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 模板不存在
- 500: 更新失败

## 订单管理接口

### 23. 下单
**路径**: `/api/orders/place`
**方法**: POST
**描述**: 下交易订单

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "template_id": "string", // 交易模板ID
  "exchange_id": "string", // 交易所密钥ID
  "order_type": "string", // 订单类型
  "amount": number, // 交易金额
  "price": number // 交易价格 (可选，市价单不需要)
}
```

**响应**: 
```json
{
  "message": "订单已下单",
  "order_id": "string", // 订单ID
  "exchange_order_id": "string" // 交易所订单ID
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 模板不存在/交易所密钥不存在
- 500: 下单失败

### 24. 获取订单列表
**路径**: `/api/orders`
**方法**: GET
**描述**: 获取用户的订单列表，支持分页和筛选

**请求参数**: 
- `token` (query parameter): JWT Token
- `page` (query parameter): 页码，默认1
- `page_size` (query parameter): 每页数量，默认20
- `status` (query parameter, optional): 订单状态
- `start_date` (query parameter, optional): 开始日期
- `end_date` (query parameter, optional): 结束日期

**响应**: 
```json
{
  "data": [
    {
      "order_id": "string", // 订单ID
      "template_id": "string", // 交易模板ID
      "exchange_order_id": "string", // 交易所订单ID
      "exchange_name": "string", // 交易所名称
      "symbol": "string", // 交易对
      "order_type": "string", // 订单类型
      "amount": number, // 交易金额
      "price": number, // 交易价格
      "status": "string", // 订单状态
      "created_at": "string", // 创建时间
      "updated_at": "string" // 更新时间
    }
  ],
  "page": integer, // 当前页码
  "page_size": integer, // 每页数量
  "total": integer, // 总数量
  "total_pages": integer // 总页数
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 25. 获取订单详情
**路径**: `/api/orders/{order_id}`
**方法**: GET
**描述**: 获取指定订单的详细信息

**请求参数**: 
- `token` (query parameter): JWT Token
- `order_id` (path parameter): 订单ID

**响应**: 
```json
{
  "order_id": "string", // 订单ID
  "template_id": "string", // 交易模板ID
  "exchange_order_id": "string", // 交易所订单ID
  "exchange_name": "string", // 交易所名称
  "symbol": "string", // 交易对
  "order_type": "string", // 订单类型
  "amount": number, // 交易金额
  "price": number, // 交易价格
  "status": "string", // 订单状态
  "created_at": "string", // 创建时间
  "updated_at": "string" // 更新时间
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 订单不存在
- 500: 获取失败

### 26. 撤销订单
**路径**: `/api/orders/cancel`
**方法**: POST
**描述**: 撤销指定的订单

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "order_id": "string" // 订单ID
}
```

**响应**: 
```json
{
  "message": "订单撤销成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 订单不存在
- 500: 撤销失败

### 27. 批量撤销订单
**路径**: `/api/orders/cancel-batch`
**方法**: POST
**描述**: 批量撤销多个订单

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "order_ids": ["string"] // 订单ID列表
}
```

**响应**: 
```json
{
  "message": "批量撤销订单处理完成",
  "success_count": integer, // 成功撤销的数量
  "failed_count": integer, // 撤销失败的数量
  "failed_ids": ["string"] // 撤销失败的订单ID列表
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 批量撤销失败

## 会员管理接口

### 28. 获取会员套餐列表
**路径**: `/api/membership/plans`
**方法**: GET
**描述**: 获取所有可用的会员套餐

**请求参数**: 无

**响应**: 
```json
{
  "plans": [
    {
      "plan_id": "string", // 套餐ID
      "name": "string", // 套餐名称
      "price": number, // 价格
      "duration_days": integer, // 持续天数
      "is_premium": boolean, // 是否为高级套餐
      "features": ["string"] // 套餐特性列表
    }
  ]
}
```

**错误码**: 
- 500: 获取失败

### 29. 获取用户当前会员信息
**路径**: `/api/membership/user`
**方法**: GET
**描述**: 获取当前用户的会员信息

**请求参数**: 
- `token` (query parameter): JWT Token

**响应**: 
```json
{
  "plan_id": "string", // 套餐ID
  "plan_name": "string", // 套餐名称
  "is_premium": boolean, // 是否为高级套餐
  "start_date": "string", // 开始日期
  "end_date": "string", // 结束日期
  "status": "string" // 状态
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 30. 购买会员套餐
**路径**: `/api/membership/purchase`
**方法**: POST
**描述**: 购买会员套餐

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "plan_id": "string" // 套餐ID
}
```

**响应**: 
```json
{
  "message": "请完成支付",
  "order_id": "string", // 支付订单ID
  "payment_url": "string" // 支付URL
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 套餐不存在
- 500: 购买失败

### 31. 会员续费
**路径**: `/api/membership/renew`
**方法**: POST
**描述**: 会员续费

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "plan_id": "string" // 套餐ID
}
```

**响应**: 
```json
{
  "message": "请完成续费支付",
  "order_id": "string", // 支付订单ID
  "payment_url": "string" // 支付URL
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 套餐不存在
- 500: 续费失败

## 支付相关接口

### 32. 查询支付订单状态
**路径**: `/api/payment/status/{order_id}`
**方法**: GET
**描述**: 查询指定支付订单的状态

**请求参数**: 
- `token` (query parameter): JWT Token
- `order_id` (path parameter): 支付订单ID

**响应**: 
```json
{
  "order_id": "string", // 支付订单ID
  "status": "string", // 订单状态 (pending/completed/cancelled/failed)
  "amount": number, // 支付金额
  "currency": "string", // 货币类型
  "created_at": "string", // 创建时间
  "updated_at": "string" // 更新时间
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 订单不存在
- 500: 查询失败

### 33. 获取支付历史记录
**路径**: `/api/payment/history`
**方法**: GET
**描述**: 获取用户的支付历史记录

**请求参数**: 
- `token` (query parameter): JWT Token
- `page` (query parameter): 页码，默认1
- `page_size` (query parameter): 每页数量，默认20
- `status` (query parameter, optional): 订单状态

**响应**: 
```json
{
  "data": [
    {
      "order_id": "string", // 支付订单ID
      "status": "string", // 订单状态
      "amount": number, // 支付金额
      "currency": "string", // 货币类型
      "created_at": "string", // 创建时间
      "updated_at": "string" // 更新时间
    }
  ],
  "page": integer, // 当前页码
  "page_size": integer, // 每页数量
  "total": integer, // 总数量
  "total_pages": integer // 总页数
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 34. 确认支付
**路径**: `/api/payment/confirm`
**方法**: POST
**描述**: 确认支付（可能用于某些支付方式的回调处理）

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "order_id": "string", // 支付订单ID
  "transaction_id": "string" // 交易ID (可选)
}
```

**响应**: 
```json
{
  "message": "支付确认成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 订单不存在
- 500: 确认支付失败

### 35. 测试epusdt支付
**路径**: `/api/payment/test-epusdt`
**方法**: GET
**描述**: 测试epusdt支付功能（仅用于测试环境）

**请求参数**: 无

**响应**: 
```json
{
  "status": "string", // 测试结果状态
  "message": "string", // 测试结果消息
  "data": {"..."} // 测试数据 (可选)
}
```

**错误码**: 
- 500: 测试失败

### 36. epusdt支付回调
**路径**: `/api/payment/epusdt-callback`
**方法**: POST
**描述**: epusdt支付网关的回调接口

**说明**: 此接口由支付网关调用，前端不需要直接调用

## 用户个人信息和通知接口

### 37. 更新用户个人信息
**路径**: `/api/auth/update-profile`
**方法**: POST
**描述**: 更新用户个人信息

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "username": "string", // 用户名 (可选)
  "email": "string" // 邮箱地址 (可选)
}
```

**响应**: 
```json
{
  "message": "个人信息更新成功"
}
```

**错误码**: 
- 401: Token无效或已过期
- 400: 该邮箱已被注册/没有提供需要更新的字段
- 404: 用户不存在
- 500: 更新失败

### 38. 获取用户统计信息
**路径**: `/api/stats/user`
**方法**: GET
**描述**: 获取用户的统计信息

**请求参数**: 
- `token` (query parameter): JWT Token

**响应**: 
```json
{
  "templates": {
    "total_templates": integer, // 总模板数量
    "public_templates": integer // 公开模板数量
  },
  "orders": {
    "total_orders": integer, // 总订单数量
    "completed_orders": integer, // 已完成订单数量
    "cancelled_orders": integer // 已取消订单数量
  },
  "membership": {
    "plan_name": "string", // 会员计划名称
    "is_premium": boolean // 是否为高级会员
  }
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 39. 获取通知
**路径**: `/api/notifications`
**方法**: GET
**描述**: 获取用户的通知列表，支持分页和筛选

**请求参数**: 
- `token` (query parameter): JWT Token
- `is_read` (query parameter, optional): 是否已读
- `page` (query parameter): 页码，默认1
- `page_size` (query parameter): 每页数量，默认20

**响应**: 
```json
{
  "data": [
    {
      "notification_id": "string", // 通知ID
      "title": "string", // 通知标题
      "content": "string", // 通知内容
      "type": "string", // 通知类型
      "is_read": boolean, // 是否已读
      "created_at": "string" // 创建时间
    }
  ],
  "page": integer, // 当前页码
  "page_size": integer, // 每页数量
  "total": integer, // 总数量
  "total_pages": integer // 总页数
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

### 40. 标记通知为已读
**路径**: `/api/notifications/read`
**方法**: POST
**描述**: 将指定的通知标记为已读

**请求参数**: 
```json
{
  "token": "string", // JWT Token
  "notification_id": "string" // 通知ID
}
```

**响应**: 
```json
{
  "message": "通知已标记为已读"
}
```

**错误码**: 
- 401: Token无效或已过期
- 404: 通知不存在
- 500: 标记失败

### 41. 批量标记通知为已读
**路径**: `/api/notifications/read-all`
**方法**: POST
**描述**: 将所有未读通知标记为已读

**请求参数**: 
- `token` (query parameter): JWT Token

**响应**: 
```json
{
  "message": "已标记 X 条通知为已读",
  "updated_count": integer // 已更新的通知数量
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 批量标记失败

### 42. 获取未读通知数量
**路径**: `/api/notifications/unread-count`
**方法**: GET
**描述**: 获取用户未读通知的数量

**请求参数**: 
- `token` (query parameter): JWT Token

**响应**: 
```json
{
  "unread_count": integer // 未读通知数量
}
```

**错误码**: 
- 401: Token无效或已过期
- 500: 获取失败

## 其他接口

### 43. 健康检查接口
**路径**: `/api/health`
**方法**: GET
**描述**: 检查系统健康状态

**请求参数**: 无

**响应**: 
```json
{
  "status": "healthy",
  "message": "Gate Trading Alert System is running"
}
```

### 44. 调试接口：检查token状态
**路径**: `/api/debug/token-status`
**方法**: POST
**描述**: 检查JWT Token的状态（仅开发环境使用）

**请求参数**: 
```json
{
  "token": "string" // JWT Token
}
```

**响应**: 
```json
{
  "status": "string", // token状态 (valid/expired/invalid)
  "user_id": "string", // 用户ID (如果token有效)
  "expires_at": "string", // 过期时间 (如果token有效)
  "current_time": "string", // 当前时间
  "error": "string" // 错误信息 (如果token无效)
}
```

## 通用错误码说明

以下是接口可能返回的通用错误码：

| 错误码 | 描述 | 可能的原因 |
|-------|------|-----------|
| 400 | 错误的请求 | 请求参数不正确或缺失必要参数 |
| 401 | 未授权 | Token无效、已过期或未提供 |
| 404 | 未找到 | 请求的资源不存在 |
| 500 | 内部服务器错误 | 服务器处理请求时发生错误 |

## 认证流程说明

1. 用户注册/登录获取JWT Token
2. 在后续请求中，将Token作为参数或放在请求头中传递
3. 服务器验证Token的有效性
4. 验证通过后，处理请求并返回结果

## 接口调用示例

以下是使用JavaScript调用接口的示例：

```javascript
// 用户登录示例
async function login(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (!response.ok) {
      throw new Error(`登录失败: ${response.status}`);
    }
    
    const data = await response.json();
    // 保存Token用于后续请求
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('登录错误:', error);
    throw error;
  }
}

// 使用Token调用需要认证的接口
async function getUserInfo() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/auth/me?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`获取用户信息失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取用户信息错误:', error);
    throw error;
  }
}
```

## 注意事项

1. 所有需要认证的接口都需要提供有效的JWT Token
2. 敏感数据（如API密钥）在传输和存储过程中会进行加密处理
3. 接口调用频率可能会有限制，具体限制请参考系统配置
4. 对于分页接口，建议使用适当的页码和每页数量以优化性能
5. 时间格式通常使用ISO 8601格式: YYYY-MM-DDTHH:MM:SSZ