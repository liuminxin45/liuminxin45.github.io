import { ArrowDownRight, Github, Mail } from 'lucide-react'

const tinyFacts = ['深圳', '工程', '笔记', '照片待补', '工具', '慢慢更新']

export default function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <div className="section-shell">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="soft-label">你好，我是</p>
            <h1>刘民心</h1>
            <p className="hero-lede">
              这里放一些正在整理的东西：文字、照片、项目入口，以及还没来得及归档的生活片刻。
            </p>
            <p className="hero-note">
              主页先保持轻一点。工作经历、项目细节和技术关键词不会堆在第一屏；如果你刚好感兴趣，可以从下面的入口慢慢点进去。
            </p>

            <div className="hero-actions">
              <a className="primary-action" href="#now">
                继续往下看
                <ArrowDownRight size={18} />
              </a>
              <a className="secondary-action" href="https://github.com/liuminxin45" target="_blank" rel="noreferrer">
                <Github size={18} />
                GitHub
              </a>
              <a className="secondary-action" href="mailto:384829308@qq.com">
                <Mail size={18} />
                邮件
              </a>
            </div>
          </div>

          <aside className="intro-card" aria-label="个人主页简介">
            <div className="portrait-placeholder">
              <span>刘</span>
            </div>
            <div>
              <p className="intro-kicker">这个小站</p>
              <h2>不是作品集，也不是简历。</h2>
              <p>
                它更像一个入口。等照片、文章和其它页面慢慢补上，这里会变得更像我本人，而不是一份资料表。
              </p>
            </div>
            <div className="fact-cloud">
              {tinyFacts.map(fact => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
