const express = require('express');
const router = express.Router();
const {
  getPublishedBlogs, getBlogBySlug, getAllBlogs, createBlog, updateBlog, deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getPublishedBlogs);
router.get('/admin/all', protect, getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, upload.single('coverImage'), createBlog);
router.put('/:id', protect, upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
