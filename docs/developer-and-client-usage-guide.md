# 多站点网站使用指南：开发者版 + 客户版

更新时间：2026-04-15

这份文档用来把现在这套系统讲清楚：

- 你自己怎么管理 12 个行业模板站
- 客户以后怎么登录后台
- 客户前台网址到底是什么
- 怎么切换行业站给客户演示
- 正式客户绑定自己域名时怎么配置

## 一句话理解

这不是 12 个独立项目，而是：

- 一套代码
- 一个后台
- 多个站点配置
- 每个站点有自己的模板、行业内容、产品、博客、询盘、报价、套餐和权限

所以你以后升级一次功能，所有客户站都能跟着升级；客户能不能用某个模块，由后台里的套餐和功能加开决定。

## 1. 管理后台入口

你的总后台入口是：

```text
https://aiexportweb.top/admin
```

这个入口也是客户后台入口。

区别不在 URL，而在登录账号的角色：

- `super_admin`：你自己用，可以管理所有站点、切换所有客户站、改套餐、加功能、建客户账号。
- `client_admin`：客户老板/负责人用，只能管理自己绑定的站点。
- `employee`：客户员工用，只能做内容、产品、询盘等日常操作，不能改套餐和站点商业配置。

也就是说：

```text
你的后台：    https://aiexportweb.top/admin
客户后台：    https://aiexportweb.top/admin
客户自己的域名后台：客户域名/admin 也可以作为入口，前提是该域名已经正确绑定到站点
```

实际交付时，最稳的做法是先统一让客户登录：

```text
https://aiexportweb.top/admin
```

客户前台网址则使用他们自己的绑定域名。

## 2. 客户前台网址是什么

客户前台网址不是固定写死的。

它取决于你在后台这个页面里给站点配置了什么域名：

```text
https://aiexportweb.top/admin/sites
```

每个站点都有：

- `Domain`
- `Subdomain`
- `Domain aliases`

系统识别当前访问哪个客户站，主要看访问请求的域名。

例如你给某个客户站配置：

```text
Domain: client-a.com
Domain aliases:
client-a.com
www.client-a.com
preview.client-a.com
```

那么下面这些地址都会进入同一个客户站：

```text
https://client-a.com/
https://www.client-a.com/
https://preview.client-a.com/
```

并且这些路径都会跟着这个客户站走：

```text
/
/about
/contact
/products
/products/...
/blog
/blog/...
/request-quote
/pricing
/privacy-policy
/terms
```

## 3. 12 个行业模板站

当前 12 个 demo 站点的系统标识如下。

| 行业 | 站点 slug | 建议正式演示子域名 |
|---|---|---|
| CNC 精密加工 | `cnc-demo` | `https://cnc.aiexportweb.top` |
| 工业设备 | `equipment-demo` | `https://equipment.aiexportweb.top` |
| 建筑建材 | `building-demo` | `https://building.aiexportweb.top` |
| 能源电力 | `energy-demo` | `https://energy.aiexportweb.top` |
| 医疗健康 | `medical-demo` | `https://medical.aiexportweb.top` |
| 流体暖通 HVAC | `hvac-demo` | `https://hvac.aiexportweb.top` |
| 照明灯具 | `lighting-demo` | `https://lighting.aiexportweb.top` |
| 五金塑胶 | `hardware-demo` | `https://hardware.aiexportweb.top` |
| 家具户外 | `furniture-demo` | `https://furniture.aiexportweb.top` |
| 包装轻纺 | `packaging-demo` | `https://packaging.aiexportweb.top` |
| 消费电子 | `electronics-demo` | `https://electronics.aiexportweb.top` |
| 礼品文创 | `gifts-demo` | `https://gifts.aiexportweb.top` |

注意：

这些子域名要真正能打开，需要你在域名 DNS 里配置对应解析，并且在 `/admin/sites` 的 `Domain aliases` 里写入这些 host。

如果 DNS 还没配好，也可以用下面的预览方式。

## 4. 不配 DNS 时，怎么切换行业站给客户看

最快方式是用 `?site=` 参数。

这些链接不依赖子域名 DNS，适合你马上演示：

```text
https://aiexportweb.top/?site=cnc-demo
https://aiexportweb.top/?site=equipment-demo
https://aiexportweb.top/?site=building-demo
https://aiexportweb.top/?site=energy-demo
https://aiexportweb.top/?site=medical-demo
https://aiexportweb.top/?site=hvac-demo
https://aiexportweb.top/?site=lighting-demo
https://aiexportweb.top/?site=hardware-demo
https://aiexportweb.top/?site=furniture-demo
https://aiexportweb.top/?site=packaging-demo
https://aiexportweb.top/?site=electronics-demo
https://aiexportweb.top/?site=gifts-demo
```

打开其中一个后，系统会把预览站点写入 cookie，后续点站内链接也会继续保持这个行业站上下文。

例如打开：

```text
https://aiexportweb.top/?site=medical-demo
```

然后继续访问：

```text
/about
/products
/blog
/request-quote
```

都会按医疗健康站显示。

## 5. 正式子域名演示怎么配置

如果你想让 12 个行业站看起来更正式，可以配置成：

```text
cnc.aiexportweb.top
equipment.aiexportweb.top
building.aiexportweb.top
energy.aiexportweb.top
medical.aiexportweb.top
hvac.aiexportweb.top
lighting.aiexportweb.top
hardware.aiexportweb.top
furniture.aiexportweb.top
packaging.aiexportweb.top
electronics.aiexportweb.top
gifts.aiexportweb.top
```

操作步骤：

1. 在 DNS 里给这些子域名添加解析，指向你的 Vercel 项目。
2. 在 Vercel 项目里添加这些 domains。
3. 进入后台：

```text
https://aiexportweb.top/admin/sites
```

4. 找到对应站点，在 `Domain aliases` 里填入对应子域名。

例如 CNC 站：

```text
cnc.aiexportweb.top
```

医疗站：

```text
medical.aiexportweb.top
```

5. 保存站点。
6. 打开子域名测试。

## 6. 你自己日常怎么管理

### 6.1 切换当前站点

登录后台后：

```text
https://aiexportweb.top/admin
```

你作为 `super_admin` 可以在后台顶部的站点切换器切换当前站点。

切到哪个站点，后台里看到和编辑的内容就应该是哪个站点的内容。

### 6.2 管理所有客户站

入口：

```text
https://aiexportweb.top/admin/sites
```

这里可以管理：

- 站点名称
- slug
- 模板
- 行业 seed pack
- 域名
- 域名别名
- 套餐
- 单项功能加开
- 销售负责人
- 商机阶段
- 续费日期
- 合同备注

### 6.3 给客户开账号

入口：

```text
https://aiexportweb.top/admin/staff
```

建议客户账号这样分：

- 客户老板：`client_admin`
- 客户员工：`employee`

客户老板可以管理自己站点和成员。

客户员工主要负责：

- 产品
- 分类
- 博客
- 页面内容
- 询盘
- 报价
- 文件资料

### 6.4 给客户升级套餐

入口：

```text
https://aiexportweb.top/admin/sites
```

把客户站点的 `Plan` 改成：

- `Basic`
- `Growth`
- `AI Sales`

保存后，下一个请求立即生效，不需要重新部署。

### 6.5 给客户单独加开功能

还是在：

```text
https://aiexportweb.top/admin/sites
```

在 `Sales panel` 里勾选额外功能。

适合这些情况：

- 客户不升整包，只买博客
- 客户不升整包，只试用 AI 回复
- 客户先试用 RAG
- 某客户单独开报价模块

## 7. 客户怎么使用

你可以直接发给客户这段。

### 客户后台登录

后台地址：

```text
https://aiexportweb.top/admin
```

如果你们已经绑定了自己的域名，也可以用：

```text
https://你的域名/admin
```

登录后，你看到的是自己公司站点的数据。

### 客户可以做什么

常用菜单：

- `Dashboard`：查看当前站点摘要
- `Products`：管理产品
- `Categories`：管理产品分类
- `Blog`：管理博客内容
- `Pages`：编辑首页、关于页、联系页模块
- `Inquiries`：查看询盘
- `Quotes`：查看报价请求
- `Media / Files`：管理图片和下载资料
- `Settings`：编辑公司名、联系方式、地址、SEO 基础信息

### 为什么有些菜单点进去会提示升级

这是正常的。

系统会保留菜单可见，但根据当前套餐锁住部分模块。

如果需要使用某个被锁住的功能，需要联系你升级套餐或单独加开功能。

## 8. 推荐演示流程

你给客户演示时可以这样走：

1. 先问客户行业。
2. 打开对应行业预览链接。
3. 给客户看：

```text
首页
产品列表
产品详情
关于页
联系页
询盘/报价页
博客页
```

4. 再登录后台切到这个站点。
5. 演示：

```text
改公司名
改产品
改首页模块
看询盘
改套餐
打开/锁住模块
```

6. 告诉客户：

```text
这不是最终交付内容，而是行业模板起点。
后续会根据你们自己的产品、资料、品牌和业务流程再调整。
```

## 9. 现在最容易搞混的点

### 客户后台地址是不是每个客户一个？

不一定。

技术上可以共用：

```text
https://aiexportweb.top/admin
```

也可以客户域名访问：

```text
https://client.com/admin
```

真正决定客户看到什么数据的，不是后台 URL，而是账号绑定的 `siteId` 和权限角色。

### 客户前台地址是什么？

客户前台地址就是你给这个站点绑定的域名。

例如：

```text
https://client.com
https://www.client.com
```

### 12 个行业站现在必须用子域名吗？

不是必须。

马上演示用：

```text
https://aiexportweb.top/?site=medical-demo
```

正式一点演示再用：

```text
https://medical.aiexportweb.top
```

前提是 DNS、Vercel domain、后台 `Domain aliases` 都配置好了。

### 每个客户以后是不是要部署一个项目？

不建议。

推荐继续保持：

- 一个 Vercel 项目
- 一套代码
- 一个 Neon 数据库
- 多个站点配置
- 多个客户域名

这样你以后升级功能，只升级这一套代码。

## 10. 给你自己的上线检查清单

每新增一个正式客户站，按这个顺序做：

1. `/admin/sites` 创建或选择客户站。
2. 配好模板和行业 seed pack。
3. 配好套餐和单项加开。
4. 配好客户域名和 `www` 域名。
5. DNS 指向 Vercel。
6. Vercel 添加域名。
7. `/admin/sites` 的 `Domain aliases` 写入所有域名。
8. `/admin/staff` 创建客户账号。
9. 用客户账号登录测试权限。
10. 打开客户域名测试前台：

```text
/
/about
/products
/contact
/request-quote
/privacy-policy
/terms
```

11. 提交一条测试询盘。
12. 后台确认询盘只进入该客户站。

