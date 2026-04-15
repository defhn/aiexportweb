# 模板补齐路线图（template-04 ~ template-12）

## 当前状态

- 已完成并接入：`template-01`、`template-02`、`template-03`
- 未完成：`template-04` ~ `template-12`
- `seed pack` 已实现：`cnc`、`industrial-equipment`、`building-materials`
- `seed pack` 未实现：`energy-power`、`medical-health`、`fluid-hvac`、`lighting`、`hardware-plastics`、`furniture-outdoor`、`textile-packaging`、`consumer-electronics`、`lifestyle`

## 优先级建议

### P0（先做，建立可复用模板骨架）

1. `template-04`（energy-power）
2. `template-05`（medical-health）
3. `template-06`（fluid-hvac）

目标：
- 先覆盖三个差异明显行业，验证模板抽象是否足够稳定
- 提炼统一的模块映射策略，避免后续 07~12 重复返工

### P1（第二批，扩展行业覆盖）

4. `template-07`（lighting）
5. `template-08`（hardware-plastics）
6. `template-09`（furniture-outdoor）

### P2（第三批，收尾与统一体验）

7. `template-10`（textile-packaging）
8. `template-11`（consumer-electronics）
9. `template-12`（lifestyle）

## 每套模板的完成定义（DoD）

每个模板都必须具备以下 6 项：

1. `src/templates/template-XX/index.ts`
2. `src/templates/template-XX/layout.tsx`
3. `src/templates/template-XX/home-page.tsx`
4. `src/templates/index.ts` 完成 import + registry 注册
5. `src/db/seed/packs/<industry>.ts` 有对应行业 seed pack，并在 `src/db/seed/index.ts` 注册
6. 至少完成一次本地切换验证：`SITE_TEMPLATE=template-XX` + 对应 seed 数据可正常渲染首页

## 推荐执行顺序（单套模板）

1. 复制最近风格模板（建议从 `template-03` 复制）创建 `template-XX`
2. 调整 `layout.tsx`（Header / Footer / 色彩系统）
3. 调整 `home-page.tsx` 的模块渲染与视觉样式
4. 在 `src/templates/index.ts` 注册
5. 新建对应 `seed pack`
6. 跑一次首页验证并修正模块兼容问题

## 关键风险与规避

- 模块 key 不一致导致页面空白
  - 规避：统一优先支持 `hero / trust-signals / featured-categories / featured-products / process-steps / final-cta`
- 只切换 `SITE_TEMPLATE` 但 seed 仍是默认 `cnc`
  - 规避：补一个模板 ID 到 seed key 的映射层，保证模板预览与行业数据一致
- 文档与实际进度脱节
  - 规避：每完成 1 套模板即更新本文件“当前状态”

## 建议下一步（可直接执行）

- 先启动 `template-04`：
  - 新建目录并完成三件套文件
  - 注册到 `src/templates/index.ts`
  - 增加 `energy-power` seed pack 并接入 `src/db/seed/index.ts`
- 完成后马上做 `template -> seed` 自动映射，减少后续人工切换成本
