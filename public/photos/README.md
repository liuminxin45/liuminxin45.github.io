# Photography

把要展示在个人主页「摄影」里的照片放到这个目录。

支持格式：`.jpg`、`.jpeg`、`.png`、`.webp`、`.avif`、`.gif`。

每张照片可以配一篇同名 Markdown 文章：

```txt
2026-06-09-desk.jpg
2026-06-09-desk.md
```

构建时会自动扫描图片，并按时间从新到旧排序。时间优先读取 Markdown frontmatter 里的 `date`；如果没有，则从文件名里的 `YYYY-MM-DD` 推断。

Markdown 示例：

```md
---
title: 工作台
date: 2026-06-09
place: 深圳
alt: 桌面和显示器
---

这是一段关于这张照片的文字。

可以写多段，也可以使用 **加粗**、`代码`、列表和引用。
```

如果暂时不写 Markdown，也可以只放图片。页面会自动生成标题和独立详情页。

`photos.json` 仍然可以作为补充 metadata 使用，但更推荐同名 Markdown。
