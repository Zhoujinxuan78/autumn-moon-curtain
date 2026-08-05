<script setup lang="ts">
import { ref, computed } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import { useCustomProducts } from '@/composables/useCustomProducts'
import { useParts } from '@/composables/useParts'
import ImageUploader from '@/components/ImageUploader.vue'
import { formatPrice, formatDateTime } from '@/utils/format'
import type { CustomProduct, CustomProductInput, Part, Category } from '@/types'

const { products, load, add, update, remove, setParts } = useCustomProducts()
const { parts } = useParts()

const showForm = ref(false)
const editingId = ref<number | null>(null)

const form = ref<CustomProductInput>({
  title: '',
  description: '',
  is_published: true,
  visible_date: null,
  location: '',
  customer_name: '',
  cover_url: '',
  image_urls: [],
})
const coverPaths = ref<string[]>([])
const galleryPaths = ref<string[]>([])
// 键为 partId，值为数量（档位由配件自身携带，无需单独选择）
const partQty = ref<Record<number, number>>({})
const visibleDateLocal = ref('')

const showPartsPicker = ref(false)

// 关联配件：按大类（category）分组折叠展示（先选类别，再展开该类别下的配件）
const openTiers = ref<string[]>([])
const categoryGroups = computed(() => {
  const map = new Map<
    string,
    { key: string; label: string; category: Category | null; parts: Part[]; selectedCount: number }
  >()
  for (const p of parts.value) {
    const c = p.category ?? null
    const key = c ? `cat-${c.id}` : 'uncat'
    if (!map.has(key)) {
      map.set(key, { key, label: c ? c.name : '未分类', category: c, parts: [], selectedCount: 0 })
    }
    map.get(key)!.parts.push(p)
  }
  const arr = Array.from(map.values())
  arr.sort((a, b) => {
    if (a.category && b.category)
      return (a.category.sort_order ?? 0) - (b.category.sort_order ?? 0) || a.label.localeCompare(b.label)
    return a.category ? -1 : 1
  })
  for (const g of arr) {
    g.selectedCount = g.parts.filter((p) => qtyOf(p.id) > 0).length
  }
  return arr
})

function isoToLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}
function localToIso(s: string): string | null {
  if (!s) return null
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function resetForm() {
  form.value = {
    title: '',
    description: '',
    is_published: true,
    visible_date: null,
    location: '',
    customer_name: '',
    cover_url: '',
    image_urls: [],
  }
  coverPaths.value = []
  galleryPaths.value = []
  partQty.value = {}
  visibleDateLocal.value = ''
  editingId.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

async function openEdit(p: CustomProduct) {
  editingId.value = p.id
  form.value = {
    title: p.title,
    description: p.description ?? '',
    is_published: p.is_published,
    visible_date: p.visible_date,
    location: p.location ?? '',
    customer_name: p.customer_name ?? '',
    cover_url: p.cover_url ?? '',
    image_urls: Array.isArray(p.image_urls) ? p.image_urls : [],
  }
  visibleDateLocal.value = isoToLocal(p.visible_date)
  coverPaths.value = p.cover_url ? [p.cover_url] : []
  galleryPaths.value = Array.isArray(p.image_urls) ? p.image_urls : []
  partQty.value = {}
  try {
    const { fetchProductParts } = await import('@/api/customProducts')
    const rows = await fetchProductParts(p.id)
    for (const r of rows) {
      const pid = r.part?.id
      if (pid) partQty.value[pid] = r.quantity
    }
  } catch {
    /* 忽略 */
  }
  showForm.value = true
}

const qtyOf = (partId: number) => partQty.value[partId] || 0
const setQty = (partId: number, v: number) => {
  partQty.value[partId] = v
}

const selectedParts = () =>
  Object.entries(partQty.value)
    .filter(([, q]) => q > 0)
    .map(([pid, q]) => ({ part_id: Number(pid), quantity: q }))

async function save() {
  if (!form.value.title) {
    showToast('请填写案例标题')
    return
  }
  const payload: CustomProductInput = {
    ...form.value,
    cover_url: coverPaths.value[0] || '',
    image_urls: galleryPaths.value,
  }
  try {
    let id = editingId.value
    if (id) {
      await update(id, payload)
      showToast('已更新')
    } else {
      const created = await add(payload)
      id = created.id
      showToast('已添加')
    }
    if (id != null) {
      await setParts(id, selectedParts())
    }
    showForm.value = false
    await load()
  } catch (e: unknown) {
    showToast((e as { message?: string })?.message || '保存失败')
  }
}

async function onDelete(p: CustomProduct) {
  await showConfirmDialog({
    title: '删除案例',
    message: `确认删除「${p.title}」？`,
  })
  try {
    await remove(p.id)
    showToast('已删除')
  } catch (e: unknown) {
    showToast((e as { message?: string })?.message || '删除失败')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold">定制案例管理</h2>
      <van-button size="small" type="primary" @click="openCreate">
        新增案例
      </van-button>
    </div>

    <div
      v-for="p in products"
      :key="p.id"
      class="card flex items-center justify-between p-3 mb-2"
    >
      <div>
        <div class="text-sm font-medium">{{ p.title }}</div>
        <div class="text-xs text-gray-400 mt-0.5">
          <span :class="p.is_published ? 'text-green-600' : 'text-red-500'">
            {{ p.is_published ? '已发布' : '草稿' }}
          </span>
          <span v-if="p.visible_date">
            · 定时 {{ formatDateTime(p.visible_date).slice(0, 16) }}
          </span>
        </div>
      </div>
      <div class="flex gap-2">
        <van-button size="mini" plain @click="openEdit(p)">编辑</van-button>
        <van-button size="mini" plain type="danger" @click="onDelete(p)">
          删除
        </van-button>
      </div>
    </div>

    <!-- 表单弹窗 -->
    <van-popup
      v-model:show="showForm"
      position="bottom"
      round
      :style="{ height: '94%' }"
    >
      <div class="p-4 overflow-y-auto" style="max-height: 94vh">
        <h3 class="text-base font-semibold mb-3">
          {{ editingId ? '编辑案例' : '新增案例' }}
        </h3>
        <van-cell-group inset>
          <van-field v-model="form.title" label="标题" placeholder="如：现代简约客厅帘" />
          <van-field v-model="form.description" label="描述" type="textarea" rows="2" />
          <van-field v-model="form.location" label="地点" placeholder="如：广州市番禺区" />
          <van-field v-model="form.customer_name" label="客户名" placeholder="如：王先生 / 某小区业主" />
          <van-field label="定时发布">
            <template #input>
              <input
                type="datetime-local"
                :value="visibleDateLocal"
                class="w-full text-sm py-1"
                @input="
                  visibleDateLocal = ($event.target as HTMLInputElement).value;
                  form.visible_date = localToIso(visibleDateLocal)
                "
              />
            </template>
          </van-field>
          <van-cell title="是否发布" center>
            <template #value><van-switch v-model="form.is_published" /></template>
          </van-cell>
          <van-cell title="封面图">
            <template #value>
              <ImageUploader v-model="coverPaths" folder="custom" :max="1" />
            </template>
          </van-cell>
          <van-cell title="完整产品图">
            <template #value>
              <ImageUploader v-model="galleryPaths" folder="custom" :max="12" />
            </template>
          </van-cell>
          <van-cell
            title="关联配件"
            :value="selectedParts().length ? `已选 ${selectedParts().length} 项` : '未选择'"
            is-link
            @click="showPartsPicker = true"
          />
        </van-cell-group>
        <div class="flex gap-3 mt-4">
          <van-button block @click="showForm = false">取消</van-button>
          <van-button block type="primary" @click="save">保存</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 关联配件选择：按类别分组，点击类别展开该类下的配件 -->
    <van-popup
      v-model:show="showPartsPicker"
      position="bottom"
      round
      :style="{ height: '80%' }"
    >
      <div class="p-3 flex flex-col" style="height: 100%">
        <div class="flex items-center justify-between mb-1">
          <div class="text-sm font-medium">选择所用配件</div>
          <van-button size="mini" plain @click="showPartsPicker = false">完成</van-button>
        </div>
        <div class="text-xs text-gray-400 mb-2">
          先选类别，再在类别下设置数量（数量 &gt; 0 即关联）
        </div>
        <div v-if="parts.length === 0" class="text-sm text-gray-400">
          请先到「配件管理」添加配件
        </div>
        <van-collapse v-else v-model="openTiers" class="parts-collapse">
          <van-collapse-item v-for="g in categoryGroups" :key="g.key" :name="g.key">
            <template #title>
              <div class="flex items-center justify-between w-full pr-3">
                <span class="text-sm font-medium">{{ g.label }}</span>
                <span class="text-[11px] text-gray-400">
                  已选 {{ g.selectedCount }} / 共 {{ g.parts.length }}
                </span>
              </div>
            </template>
            <div v-for="p in g.parts" :key="p.id" class="card p-2 mb-2">
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ p.name }}</span>
              </div>
              <div class="flex items-center justify-between mt-1.5">
                <span class="text-xs text-gray-400">
                  {{ formatPrice(p.price, p.price_unit) }}
                </span>
                <van-stepper
                  :model-value="qtyOf(p.id)"
                  min="0"
                  integer
                  @change="(v: number) => setQty(p.id, v)"
                />
              </div>
            </div>
            <div v-if="g.parts.length === 0" class="text-xs text-gray-400 py-1">
              该类别下暂无配件
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </van-popup>
  </div>
</template>
