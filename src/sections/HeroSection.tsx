export default function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <div className="section-shell">
        <p className="soft-label">个人主页</p>
        <h1>你好，我是刘民心。</h1>
        <div className="hero-copy">
          <p>
            这里会慢慢放一些我想留下来的东西：文字、项目入口、照片、工具，以及一些还没有完全整理好的生活片段。
          </p>
          <p>
            我希望它更像一个安静的个人空间，而不是一份在线简历。工作相关的内容放在单独页面里，需要的时候再点进去看。
          </p>
        </div>
        <div className="hero-links" aria-label="常用入口">
          <a href="#now">最近</a>
          <a href="#builds">入口</a>
          <a href="/work">工作相关</a>
          <a href="mailto:384829308@qq.com">邮件</a>
        </div>
      </div>
    </section>
  )
}
