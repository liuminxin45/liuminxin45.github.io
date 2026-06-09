import { Link } from 'react-router'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const highlights = [
  'C++ / Qt 客户端',
  '跨平台 SDK',
  '工业视觉设备软件',
  '自动化测试',
]

const workItems = [
  {
    title: '跨平台工业相机 SDK',
    text: '围绕设备发现、连接管理、图像采集、参数访问和事件回调，整理一套可复用的 C ABI 接口模型。',
    points: ['Windows / Linux x86_64 / Linux ARM64', 'GenICam / GigE Vision / USB3 Vision', '40+ 设备型号'],
  },
  {
    title: '工业视觉 Qt 客户端',
    text: '参与工业相机、智能相机、读码器三类客户端建设，负责设备接入、参数配置、图像显示和公共模块沉淀。',
    points: ['三类客户端', '公共组件', '状态同步'],
  },
  {
    title: '虚拟相机与自动化测试体系',
    text: '用虚拟设备降低真实硬件依赖，并把 SDK、Qt 客户端、Electron 平台的核心链路接入回归流程。',
    points: ['500+ 自动化用例', 'Jenkins', '覆盖率统计'],
  },
  {
    title: 'Electron / NAPI 插件平台',
    text: '设计插件模型、生命周期、依赖校验和 Native 能力接入链路，服务客户端平台化迁移。',
    points: ['plugin.json', 'RPC', 'NAPI'],
  },
]

export default function WorkPage() {
  return (
    <main className="work-page">
      <div className="section-shell">
        <Link className="back-link" to="/">
          <ArrowLeft size={17} />
          回到首页
        </Link>

        <section className="work-hero">
          <p className="soft-label">工作相关</p>
          <h1>工作相关的一页。</h1>
          <p>
            我把这些内容放在子页面里，避免首页变成在线简历。这里保留必要背景，方便需要了解合作经验、技术栈或项目类型的人快速扫一眼。
          </p>
          <div className="fact-cloud">
            {highlights.map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="work-list">
          {workItems.map(item => (
            <article className="work-card" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <div className="mini-tags">
                {item.points.map(point => (
                  <span key={point}>{point}</span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="work-contact">
          <h2>更完整的信息可以直接聊。</h2>
          <a href="mailto:384829308@qq.com">
            发邮件
            <ExternalLink size={16} />
          </a>
        </section>
      </div>
    </main>
  )
}
