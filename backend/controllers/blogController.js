const Blog = require('../models/Blog');
const { cloudinary } = require('../config/cloudinary');

const slugify = (str) => String(str || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

// Append -2, -3... until the slug is free (ignoring the post being edited).
const uniqueSlug = async (base, excludeId) => {
  const root = base || 'post';
  let slug = root;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await Blog.exists({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${root}-${n++}`;
  }
  return slug;
};

const pickFields = (body) => {
  const fields = ['title', 'excerpt', 'content', 'author', 'metaTitle', 'metaDescription', 'status'];
  return fields.reduce((acc, k) => (body[k] !== undefined ? { ...acc, [k]: body[k] } : acc), {});
};

// Public: published posts only
exports.getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .select('-content')
      .sort({ publishedAt: -1, createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: all posts including drafts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const data = pickFields(req.body);
    data.slug = await uniqueSlug(slugify(req.body.slug || data.title));
    if (data.status === 'published') data.publishedAt = new Date();
    if (req.file) {
      data.coverImage = req.file.path;
      data.coverImagePublicId = req.file.filename;
    }
    const blog = await Blog.create(data);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });

    const data = pickFields(req.body);
    if (req.body.slug !== undefined || data.title !== undefined) {
      const base = slugify(req.body.slug || data.title || blog.title);
      if (base !== blog.slug) data.slug = await uniqueSlug(base, blog._id);
    }
    if (data.status === 'published' && !blog.publishedAt) data.publishedAt = new Date();
    if (req.file) {
      if (blog.coverImagePublicId) await cloudinary.uploader.destroy(blog.coverImagePublicId);
      data.coverImage = req.file.path;
      data.coverImagePublicId = req.file.filename;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });

    if (blog.coverImagePublicId) await cloudinary.uploader.destroy(blog.coverImagePublicId);
    await blog.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
