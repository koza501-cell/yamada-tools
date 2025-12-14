const fs = require('fs');
const blogs = JSON.parse(fs.readFileSync('./src/data/dynamicBlogs.json', 'utf-8'));

// Publishing schedule (future dates)
const schedule = {
  "blog-dec14-pdf-compress": "2024-12-14",
  "blog-dec17-pdf-email": "2024-12-17",
  "blog-dec19-pdf-merge": "2024-12-19",
  "blog-dec21-image-upload": "2024-12-21",
  "blog-dec24-excel-to-pdf": "2024-12-24",
  "blog-dec26-pdf-split": "2024-12-26",
  "blog-dec28-pdf-password": "2024-12-28",
  "blog-dec31-invoice": "2024-12-31",
  "blog-jan02-hanko": "2025-01-02",
  "blog-jan04-wareki": "2025-01-04"
};

blogs.forEach(blog => {
  if (schedule[blog.slug]) {
    blog.publishDate = schedule[blog.slug];
  }
});

fs.writeFileSync('./src/data/dynamicBlogs.json', JSON.stringify(blogs, null, 2));
console.log('✅ Dates updated to future schedule!');
console.log('📅 Dec 14 - First blog will show');
console.log('📅 Dec 17 - Second blog will show');
console.log('📅 ... and so on until Jan 4');
