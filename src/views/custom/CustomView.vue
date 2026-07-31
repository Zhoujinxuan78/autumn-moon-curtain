<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCustomProducts } from '@/composables/useCustomProducts'
import ProductCard from '@/components/ProductCard.vue'
import EmptyState from '@/components/EmptyState.vue'

// 公开页面仅展示已发布成品（RLS 已保证 visible_date 过滤）
const { products, loading, load } = useCustomProducts({ publishedOnly: true })

const search = ref('')
const startDate = ref('')
const endDate = ref('')
const rangeKey = ref<'all' | '1m' | '3m' | '6m'>('all')

const ranges: { key: 'all' | '1m' | '3m' | '6m'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: '1m', label: '近一月' },
  { key: '3m', label: '近三月' },
  { key: '6m', label: '近半年' },
]

function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function reload() {
  load({ search: search.value, startDate: startDate.value, endDate: endDate.value })
}

function pickRange(key: 'all' | '1m' | '3m' | '6m') {
  rangeKey.value = key
  if (key === 'all') {
    startDate.value = ''
    endDate.value = ''
  } else {
    const months = key === '1m' ? 1 : key === '3m' ? 3 : 6
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - months)
    startDate.value = toISO(start)
    endDate.value = toISO(end)
  }
  reload()
}

function clearFilters() {
  search.value = ''
  startDate.value = ''
  endDate.value = ''
  rangeKey.value = 'all'
  load()
}

// 搜索输入防抖（300ms），避免每次按键都打数据库
let timer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(reload, 300)
})
// 日期变更即时筛选
watch([startDate, endDate], reload)
</script>

<template>
  <div class="page">
    <!-- 页头：暖色帘幕主视觉（与首页风格统一） -->
    <header class="hero">
      <div class="rod"><span class="finial" /><span class="finial" /></div>
      <div class="curtain curtain-left" />
      <div class="curtain curtain-right" />
      <div class="hero-glow" />
      <div class="hero-inner">
        <p class="eyebrow">帘语 · 真实落地</p>
        <h1 class="display-serif hero-title">客户定制案例</h1>
        <p class="hero-sub">看得见的专业，摸得着的质感。</p>
      </div>
    </header>

    <!-- 筛选区 -->
    <div class="filters">
      <div class="box-search">
        <van-icon name="search" class="ico-search" />
        <input
          v-model="search"
          type="text"
          class="input-search"
          placeholder="搜索名称 / 地址 / 客户名"
        />
        <van-icon
          v-if="search"
          name="clear"
          class="ico-clear"
          @click="search = ''"
        />
      </div>

      <div class="date-row">
        <div class="date-chip">
          <van-icon name="clock-o" class="chip-ico" />
          <input v-model="startDate" type="date" class="date-input" aria-label="起始日期" />
          <span class="chip-sep">~</span>
          <input v-model="endDate" type="date" class="date-input" aria-label="结束日期" />
        </div>
        <van-button size="small" plain class="clear-btn" @click="clearFilters">
          清空
        </van-button>
      </div>

      <div class="range-chips">
        <button
          v-for="r in ranges"
          :key="r.key"
          class="range-chip"
          :class="{ 'range-chip--active': rangeKey === r.key }"
          @click="pickRange(r.key)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <!-- 结果计数 -->
    <div class="result-bar" v-if="!loading">
      <span>共 {{ products.length }} 个案例</span>
    </div>

    <van-loading v-if="loading" class="block mx-auto mt-10" />
    <div v-else-if="products.length" class="grid grid-cols-2 gap-3 px-4">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <EmptyState v-else text="未找到匹配的案例" />
  </div>
</template>

<style scoped>
.page {
  padding-bottom: 24px;
}

/* ===== 页头帘幕主视觉（紧凑版，呼应首页） ===== */
.hero {
  position: relative;
  margin: 12px;
  padding: 40px 20px 42px;
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(155deg, #cf8a5c 0%, #b5683f 52%, #8f4f2e 100%);
  box-shadow: 0 20px 44px -26px rgba(58, 44, 34, 0.5);
  isolation: isolate;
}
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
.rod .finial:first-child { left: -8px; }
.rod .finial:last-child { right: -8px; }

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
.curtain-left { left: 0; border-right: 2px solid rgba(201, 162, 75, 0.5); }
.curtain-right { right: 0; border-left: 2px solid rgba(201, 162, 75, 0.5); }

.hero-glow {
  position: absolute;
  inset: 12px 26% 0 26%;
  background: radial-gradient(120% 80% at 50% 30%, rgba(255, 244, 224, 0.32), transparent 70%);
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
  margin-top: 8px;
  font-size: 26px;
  color: #fff;
  text-shadow: 0 2px 10px rgba(58, 44, 34, 0.3);
}
.hero-sub {
  margin: 10px auto 0;
  max-width: 240px;
  font-size: 13px;
  line-height: 1.7;
  color: #fbeede;
  opacity: 0.92;
  text-shadow: 0 1px 6px rgba(58, 44, 34, 0.35);
}

/* ===== 筛选区 ===== */
.filters {
  padding: 4px 16px 0;
}
/* 搜索框：主题化，带图标 */
.box-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--curtain-surface);
  border: 1px solid var(--curtain-line);
  border-radius: 14px;
  padding: 10px 14px;
  box-shadow: 0 8px 22px -16px rgba(58, 44, 34, 0.3);
}
.box-search .ico-search {
  color: var(--curtain-ink-soft);
  flex-shrink: 0;
}
.box-search .ico-clear {
  color: #c9b9a3;
  flex-shrink: 0;
}
.box-search .input-search {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--curtain-ink);
  font-family: var(--curtain-font-sans);
}
.box-search .input-search::placeholder {
  color: #b6a691;
}

/* 日期范围行 */
.date-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.date-chip {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--curtain-surface);
  border: 1px solid var(--curtain-line);
  border-radius: 12px;
  padding: 8px 12px;
}
.chip-ico {
  color: var(--curtain-primary);
  flex-shrink: 0;
}
.chip-sep {
  color: var(--curtain-ink-soft);
}
.date-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: var(--curtain-ink);
  font-family: var(--curtain-font-sans);
  max-width: 110px;
}
.date-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}
.clear-btn {
  flex-shrink: 0;
  border-color: var(--curtain-line) !important;
  color: var(--curtain-ink-soft) !important;
}

/* 快捷时间范围 chips */
.range-chips {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.range-chip {
  flex-shrink: 0;
  border: 1px solid var(--curtain-line);
  background: var(--curtain-surface);
  color: var(--curtain-ink-soft);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-family: var(--curtain-font-sans);
  transition: all 0.2s ease;
}
.range-chip--active {
  background: var(--curtain-primary);
  border-color: var(--curtain-primary);
  color: #fff;
  box-shadow: 0 6px 16px -8px rgba(181, 104, 63, 0.7);
}

.result-bar {
  padding: 14px 16px 4px;
  font-size: 13px;
  color: var(--curtain-ink-soft);
}
</style>
