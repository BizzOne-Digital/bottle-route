import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BlogContent from '../components/ui/BlogContent';
import { blogsApi } from '../utils/api';
import { formatDate } from './Blog';
import './Blog.css';

const setMeta = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content || '');
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    blogsApi.getBySlug(slug)
      .then(({ data }) => {
        setPost(data.data);
        setStatus('ok');
        document.title = `${data.data.metaTitle || data.data.title} | Bottle Route`;
        setMeta('description', data.data.metaDescription || data.data.excerpt);
      })
      .catch(() => setStatus('missing'));
  }, [slug]);

  if (status !== 'ok') {
    return (
      <main className="blog">
        <section className="blog__hero">
          <div className="container">
            <p className="blog__empty">{status === 'loading' ? 'Loading...' : 'This post could not be found.'}</p>
            {status === 'missing' && <Link to="/blog" className="blog-post__back"><ArrowLeft size={16} /> Back to blog</Link>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="blog">
      <article className="blog-post container">
        <Link to="/blog" className="blog-post__back"><ArrowLeft size={16} /> Back to blog</Link>
        <p className="blog-card__date">{formatDate(post.publishedAt || post.createdAt)} · {post.author}</p>
        <h1 className="blog-post__title">{post.title}</h1>
        {post.coverImage && <img className="blog-post__cover" src={post.coverImage} alt={post.title} />}
        <BlogContent content={post.content} />
      </article>
    </main>
  );
}
