# Web Monitor 使用示例

本目录包含了不同模块规范下的使用示例：

## CommonJS (cjs)
适用于 CommonJS 模块规范的项目：
```js
const { Monitor } = require('@web-monitor/core')
```

## ES Modules (esm)
适用于现代浏览器或使用 ES Modules 的项目：
```js
import { Monitor } from '@web-monitor/core'
```

## UMD
适用于直接在浏览器中通过 `<script>` 标签使用：
```html
<script src="path/to/web-monitor.umd.js"></script>
<script>
  const monitor = new WebMonitor.Monitor({...})
</script>
```

## 运行示例

1. 先构建项目：
```bash
npm run build
```

2. 启动示例服务器：
```bash
cd examples
npm start
```

3. 访问对应的示例：
- CJS: http://localhost:3000/cjs
- ESM: http://localhost:3000/esm
- UMD: http://localhost:3000/umd 