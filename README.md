# 人民币大写转换器

## 简介
人民币大写转换器是一个纯前端的工具，可将阿拉伯数字金额转换为中文大写金额，并提供复制与朗读等便捷操作。

## 功能
- 数字输入框与屏幕键盘，便于在触控设备上输入金额（见 [src/index.html](src/index.html)）
- 实时转换与结果展示逻辑（见 [src/main.mjs](src/main.mjs)）
- 人民币金额中文大写转换算法（见 [src/rmbconverter.mjs](src/rmbconverter.mjs)）
- 语音朗读与剪贴板复制等辅助功能（见 [src/utils.mjs](src/utils.mjs)）
- 响应式界面样式（见 [src/styles.css](src/styles.css)）

## 开发说明
- 事件绑定与界面交互集中在 [`main.mjs`](src/main.mjs)。
- 金额转换逻辑位于 [`rmbconverter.mjs`](src/rmbconverter.mjs)，可按需扩展规则。
- 通用工具函数整理在 [`utils.mjs`](src/utils.mjs)。
- 样式覆盖在 [`styles.css`](src/styles.css)，遵循 BEM 命名以便维护。

