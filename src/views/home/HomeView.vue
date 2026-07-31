<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '@/composables/useCategories'
import { useParts } from '@/composables/useParts'
import PartCard from '@/components/PartCard.vue'

const router = useRouter()
const { categories } = useCategories({ activeOnly: true })
const { parts, loading } = useParts({ publishedOnly: true })

const featured = computed(() => parts.value.slice(0, 4))

const go = (to: string) => router.push(to)

const steps = [
  { n: '1', title: '免费量窗', desc: '上门或自助测量窗洞尺寸' },
  { n: '2', title: '方案设计', desc: '按风格与预算搭配配件' },
  { n: '3', title: '加工制作', desc: '精选布料与五金落地' },
  { n: '4', title: '上门安装', desc: '专业安装，一次到位' },
]
</script>

<template>
  <div class="home">
    <!-- 帘幕主视觉 -->
    <section class="hero">
      <div class="rod"><span class="finial" /><span class="finial" /></div>
      <div class="curtain curtain-left" />
      <div class="curtain curtain-right" />
      <div class="hero-glow" />
      <div class="hero-inner">
        <p class="eyebrow">帘语 · 窗帘展示与定制</p>
        <h1 class="display-serif hero-title">为每一扇窗<br />定制一帘温柔</h1>
        <p class="hero-sub">专注窗帘配件与落地定制，看得见的专业，摸得着的质感。</p>
        <div class="hero-cta">
          <van-button round type="primary" @click="go('/parts')">浏览配件</van-button>
          <van-button round class="cta-ghost" @click="go('/custom')">看定制案例</van-button>
        </div>
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="section entries">
      <div class="entry" @click="go('/parts')">
        <span class="entry-ico" style="background: var(--curtain-primary-soft)">
          <van-icon name="apps-o" color="#b5683f" />
        </span>
        <div class="entry-text">
          <div class="entry-title">零配件展示</div>
          <div class="entry-desc">导轨 · 布带 · 挂钩 · 花边</div>
        </div>
        <van-icon name="arrow" class="entry-arrow" />
      </div>
      <div class="entry" @click="go('/custom')">
        <span class="entry-ico" style="background: rgba(201, 162, 75, 0.16)">
          <van-icon name="photo-o" color="#c9a24b" />
        </span>
        <div class="entry-text">
          <div class="entry-title">客户定制案例</div>
          <div class="entry-desc">真实落地成品图</div>
        </div>
        <van-icon name="arrow" class="entry-arrow" />
      </div>
    </section>

    <!-- 产品分类 -->
    <section class="section" v-if="categories.length">
      <h2 class="section-title display-serif">产品分类</h2>
      <div class="cat-grid">
        <div
          v-for="c in categories"
          :key="c.id"
          class="cat-card"
          @click="go('/parts')"
        >
          <span class="cat-initial">{{ c.name.slice(0, 1) }}</span>
          <span class="cat-name">{{ c.name }}</span>
          <van-icon name="chevron-right" class="cat-go" />
        </div>
      </div>
    </section>

    <!-- 精选配件 -->
    <section class="section" v-if="!loading && featured.length">
      <div class="section-head">
        <h2 class="section-title display-serif">精选配件</h2>
        <span class="more" @click="go('/parts')">全部 ›</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <PartCard v-for="p in featured" :key="p.id" :part="p" />
      </div>
    </section>

    <!-- 定制流程 -->
    <section class="section">
      <h2 class="section-title display-serif">定制流程</h2>
      <div class="steps">
        <div v-for="s in steps" :key="s.n" class="step">
          <span class="step-n">{{ s.n }}</span>
          <div class="step-title">{{ s.title }}</div>
          <div class="step-desc">{{ s.desc }}</div>
        </div>
      </div>
    </section>

    <!-- CTA 横幅 -->
    <section class="cta">
      <h3 class="display-serif">想要专属窗景？</h3>
      <p>从配件到整窗落地，我们帮你一次搞定。</p>
      <van-button round type="primary" @click="go('/custom')">查看定制案例</van-button>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 8px;
}

/* ===== 帘幕主视觉 ===== */
.hero {
  position: relative;
  margin: 12px;
  padding: 56px 20px 60px;
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(155deg, #cf8a5c 0%, #b5683f 52%, #8f4f2e 100%);
  box-shadow: 0 20px 44px -26px rgba(58, 44, 34, 0.5);
  isolation: isolate;
}
/* 帘杆 + 两端金球 */
.rod {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  background: linear-gradient(180deg, #e7c479, #b9893f);
  z-index: 3;
}
.rod .finial {
  position: absolute;
  top: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f3d89a, #b9893f);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}
.rod .finial:first-child {
  left: -8px;
}
.rod .finial:last-child {
  right: -8px;
}

/* 左右帘布：织物竖向褶皱 */
.curtain {
  position: absolute;
  top: 12px;
  bottom: 0;
  width: 26%;
  background-image: repeating-linear-gradient(
      90deg,
      rgba(40, 26, 18, 0.22) 0,
      rgba(40, 26, 18, 0) 14px,
      rgba(255, 240, 225, 0.16) 26px,
      rgba(40, 26, 18, 0.22) 40px
    ),
    linear-gradient(180deg, #9c5631 0%, #7c3f23 100%);
  box-shadow: inset 0 8px 18px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.curtain-left {
  left: 0;
  border-right: 2px solid rgba(201, 162, 75, 0.5);
}
.curtain-right {
  right: 0;
  border-left: 2px solid rgba(201, 162, 75, 0.5);
}

/* 中部透光柔光（窗光感） */
.hero-glow {
  position: absolute;
  inset: 12px 26% 0 26%;
  background: radial-gradient(
    120% 80% at 50% 30%,
    rgba(255, 244, 224, 0.32),
    transparent 70%
  );
  z-index: 2;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 4;
  text-align: center;
  color: #fff;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: #f6e2c4;
  opacity: 0.9;
}
.hero-title {
  margin-top: 10px;
  font-size: 30px;
  line-height: 1.32;
  color: #fff;
  text-shadow: 0 2px 10px rgba(58, 44, 34, 0.3);
}
.hero-sub {
  margin: 14px auto 0;
  max-width: 280px;
  font-size: 13px;
  line-height: 1.7;
  color: #fbeede;
  opacity: 0.92;
  text-shadow: 0 1px 6px rgba(58, 44, 34, 0.35);
}
.hero-cta {
  margin-top: 22px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
.cta-ghost {
  background: #fff !important;
  color: var(--curtain-primary) !important;
  border: none !important;
}

/* ===== 通用区块 ===== */
.section {
  padding: 4px 16px;
  margin-top: 18px;
}
.section-title {
  font-size: 19px;
  color: var(--curtain-ink);
  margin: 0 0 12px;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.more {
  font-size: 13px;
  color: var(--curtain-primary);
}

/* 快捷入口 */
.entries {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.entry {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--curtain-surface);
  border: 1px solid var(--curtain-line);
  border-radius: 16px;
  padding: 14px 16px;
  cursor: pointer;
  box-shadow: 0 8px 22px -16px rgba(58, 44, 34, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.entry:active {
  transform: scale(0.985);
}
.entry-ico {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.entry-text {
  flex: 1;
}
.entry-title {
  font-weight: 600;
  color: var(--curtain-ink);
}
.entry-desc {
  font-size: 12px;
  color: var(--curtain-ink-soft);
  margin-top: 2px;
}
.entry-arrow {
  color: #cbb89c;
}

/* 分类网格 */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.cat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--curtain-surface), var(--curtain-bg-soft));
  border: 1px solid var(--curtain-line);
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.cat-card:active {
  transform: scale(0.985);
}
.cat-initial {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-family: var(--curtain-font-serif);
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(150deg, #c87b4e, #8f4f2e);
}
.cat-name {
  flex: 1;
  font-weight: 600;
  color: var(--curtain-ink);
}
.cat-go {
  color: #cbb89c;
}

/* 定制流程 */
.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.step {
  background: var(--curtain-surface);
  border: 1px solid var(--curtain-line);
  border-radius: 14px;
  padding: 14px 8px;
  text-align: center;
}
.step-n {
  width: 26px;
  height: 26px;
  margin: 0 auto 8px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
  font-size: 13px;
  background: linear-gradient(150deg, #c9a24b, #b5683f);
}
.step-title {
  font-weight: 600;
  color: var(--curtain-ink);
  font-size: 13px;
}
.step-desc {
  font-size: 11px;
  color: var(--curtain-ink-soft);
  margin-top: 3px;
  line-height: 1.4;
}

/* CTA 横幅 */
.cta {
  margin: 22px 16px 8px;
  padding: 26px 20px;
  border-radius: 20px;
  text-align: center;
  background: linear-gradient(155deg, #f2e2d6, #e9ddc9);
  border: 1px solid var(--curtain-line);
}
.cta h3 {
  font-size: 20px;
  color: var(--curtain-ink);
  margin: 0;
}
.cta p {
  font-size: 13px;
  color: var(--curtain-ink-soft);
  margin: 8px 0 16px;
}
</style>
