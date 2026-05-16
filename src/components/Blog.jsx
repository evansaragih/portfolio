const posts = [
  {
    img: 'https://www.figma.com/api/mcp/asset/bb3ae225-fbf2-424e-8d68-6bf621617dd4',
    tag: 'Personal Notes',
    title: "Why I'm Becoming a Product Designer",
    excerpt: 'Sometimes you need to evolve beyond what\'s comfortable.',
  },
  {
    img: 'https://www.figma.com/api/mcp/asset/07a6b303-82e2-4387-89ec-8636099d109c',
    tag: 'Personal Notes',
    title: 'A Bit About Me',
    excerpt: 'My journey began in a different kind of design.',
  },
];

export default function Blog() {
  return (
    <section className="blog" id="blog">
      <div className="container">
        <div className="blog-header" data-reveal>
          <h2 className="section-title">Blog</h2>
          <p className="section-sub">
            I share my design thinking, curations, aesthetic taste, and industry observations through long-form essays.
          </p>
        </div>
        <div className="blog-grid">
          {posts.map((post, i) => (
            <article className="blog-card" key={i} data-reveal>
              <div className="blog-img-wrap">
                <img src={post.img} alt={post.title} className="blog-img" />
              </div>
              <div className="blog-card-body">
                <p className="blog-tag">{post.tag}</p>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
