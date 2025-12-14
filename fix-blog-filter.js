const fs = require('fs');
let content = fs.readFileSync('./src/app/blog/page.tsx', 'utf-8');

// Replace the allBlogs line with date-filtered version
const oldCode = `  const allBlogs = [...dynamicBlogs, ...staticBlogs].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });`;

const newCode = `  // Filter blogs: only show if publishDate <= today
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  const allBlogs = [...dynamicBlogs, ...staticBlogs]
    .filter(blog => {
      const publishDate = new Date(blog.publishDate);
      return publishDate <= today;
    })
    .sort((a, b) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('./src/app/blog/page.tsx', content);
console.log('✅ Date filter added!');
