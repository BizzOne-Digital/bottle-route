import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { blogsApi } from '../utils/api';
import './Blog.css';

export const formatDate = (d) => (d
  ? new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  : '');

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Blog | Bottle Route';
    blogsApi.getPublished()
      .then(({ data }) => setPosts(data.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="blog">
      <section className="blog__hero">
        <Reveal className="container">
          <p className="section-eyebrow">Blog</p>
          <h1 className="section-title">NEWS &amp; <span className="text-accent">GUIDES.</span></h1>
        </Reveal>
      </section>

      <section className="section-sm">
        <div className="container">
          {loading ? (
            <p className="blog__empty">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="blog__empty">No posts yet. Check back soon.</p>
          ) : (
            <div className="blog__grid">
              {posts.map((p) => (
                <Link key={p._id} to={`/blog/${p.slug}`} className="blog-card">
                  {p.coverImage && <div className="blog-card__img" style={{ backgroundImage: `url(${p.coverImage})` }} />}
                  <div className="blog-card__body">
                    <p className="blog-card__date">{formatDate(p.publishedAt || p.createdAt)}</p>
                    <h2 className="blog-card__title">{p.title}</h2>
                    {p.excerpt && <p className="blog-card__excerpt">{p.excerpt}</p>}
                    <span className="blog-card__more">Read more</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
