## 技术栈

- **框架**: Next.js 16 + React 19
- **样式**: Tailwind CSS 4
- **渲染**: marked + shiki（代码高亮）
- **部署**: Vercel

## 为什么选 Next.js

终于把个人博客搭建好了，也是有自己的小窝了
作为一名计算机专业学生，我想要一个：

1. 能用 Markdown 写文章，不用数据库
2. 部署简单，最好是免费的
3. 可以自定义样式，不要千篇一律的模板
4. 支持暗色模式

Next.js 的 App Router + 静态文件读取完美满足这些需求。

## 代码高亮测试

```typescript
// 快速排序
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x <= pivot);
  const right = arr.slice(1).filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

## 引用

> 写博客不是为了给别人看，是为了给自己看。三个月后回头看，你会发现自己的成长。

## 表格

| 工具 | 用途 |
|------|------|
| Next.js | 框架 |
| Tailwind | 样式 |
| shiki | 代码高亮 |
| Vercel | 部署 |

---

感谢阅读！🎉
