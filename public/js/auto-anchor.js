hexo.extend.filter.register('before_post_render', function(data) {
  // 仅处理顶级标题（#开头），保持子标题不变
  data.content = data.content.replace(/^#\s+(.+)$/gm, (match, title) => {
    const id = 'section-' + title.trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
    return `# <span id="${id}">${title}</span>`;
  });
  return data;
});
