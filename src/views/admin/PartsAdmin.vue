<script setup lang="ts">
import { ref } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import { useParts } from '@/composables/useParts'
import { useCategories } from '@/composables/useCategories'
import ImageUploader from '@/components/ImageUploader.vue'
import type { Part, PartInput, Category } from '@/types'

const { parts, load, add, update, remove } = useParts()
const { categories } = useCategories()

const showForm = ref(false)
const editingId = ref<number | null>(null)

const form = ref<PartInput>({
  name: '',
  category_id: null,
  description: '',
  price: null,
  price_unit: '个',
  is_published: true,
  image_url: '',
  gallery: [],
  specs: {},
})
const priceText = ref('')
const specsText = ref('{}')
const coverPaths = ref<string[]>([])
const galleryPaths = ref<string[]>([])

const showCatPicker = ref(false)
const catOptions = ref<Array<{ text: string; value: number | null }>>([])

function resetForm() {
  form.value = {
    name: '',
    category_id: null,
    description: '',
    price: null,
    price_unit: '个',
    is_published: true,
    image_url: '',
    gallery: [],
    specs: {},
  }
  priceText.value = ''
  specsText.value = '{}'
  coverPaths.value = []
  galleryPaths.value = []
  editingId.value = null
}

function openCreate() {
  resetForm()
  catOptions.value = [
    { text: '未分类', value: null },
    ...categories.value.map((c: Category) => ({ text: c.name, value: c.id })),
  ]
  showForm.value = true
}

function openEdit(p: Part) {
  editingId.value = p.id
  form.value = {
    name: p.name,
    category_id: p.category_id,
    description: p.description ?? '',
    price: p.price,
    price_unit: p.price_unit ?? '个',
    is_published: p.is_published,
    image_url: p.image_url ?? '',
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    specs: p.specs ?? {},
  }
  priceText.value = p.price != null ? String(p.price) : ''
  specsText.value = JSON.stringify(p.specs ?? {}, null, 2)
  coverPaths.value = p.image_url ? [p.image_url] : []
  galleryPaths.value = Array.isArray(p.gallery) ? p.gallery : []
  catOptions.value = [
    { text: '未分类', value: null },
    ...categories.value.map((c: Category) => ({ text: c.name, value: c.id })),
  ]
  showForm.value = true
}

const catText = () =>
  catOptions.value.find((o) => o.value === form.value.category_id)?.text || '未分类'

function onCatConfirm({ selectedValues }: { selectedValues: (number | null)[] }) {
  form.value.category_id = selectedValues[0] ?? null
  showCatPicker.value = false
}

async function save() {
  if (!form.value.name) {
    showToast('请填写配件名称')
    return
  }
  let specs: Record<string, string> = {}
  try {
    specs = JSON.parse(specsText.value || '{}')
  } catch {
    showToast('规格参数不是合法 JSON')
    return
  }
  const payload: PartInput = {
    ...form.value,
    price: priceText.value ? Number(priceText.value) : null,
    image_url: coverPaths.value[0] || '',
    gallery: galleryPaths.value,
    specs,
  }
  try {
    if (editingId.value) {
      await update(editingId.value, payload)
      showToast('已更新')
    } else {
      await add(payload)
      showToast('已添加')
    }
    showForm.value = false
    await load()
  } catch (e: unknown) {
    showToast((e as { message?: string })?.message || '保存失败')
  }
}

async function onDelete(p: Part) {
  await showConfirmDialog({
    title: '删除配件',
    message: `确认删除「${p.name}」？`,
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
      <h2 class="text-base font-semibold">配件管理</h2>
      <van-button size="small" type="primary" @click="openCreate">
        新增配件
      </van-button>
    </div>

    <div
      v-for="p in parts"
      :key="p.id"
      class="card flex items-center justify-between p-3 mb-2"
    >
      <div>
        <div class="text-sm font-medium">{{ p.name }}</div>
        <div class="text-xs text-gray-400 mt-0.5">
          {{ p.price != null ? '¥' + p.price : '面议' }}
          <span :class="p.is_published ? 'text-green-600' : 'text-red-500'">
            · {{ p.is_published ? '已发布' : '草稿' }}
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

    <van-popup
      v-model:show="showForm"
      position="bottom"
      round
      :style="{ height: '92%' }"
    >
      <div class="p-4 overflow-y-auto" style="max-height: 92vh">
        <h3 class="text-base font-semibold mb-3">
          {{ editingId ? '编辑配件' : '新增配件' }}
        </h3>
        <van-cell-group inset>
          <van-field v-model="form.name" label="名称" placeholder="配件名称" />
          <van-cell title="分类" :value="catText()" is-link @click="showCatPicker = true" />
          <van-field v-model="form.description" label="描述" type="textarea" rows="2" />
          <van-field v-model="priceText" label="价格" type="number" placeholder="留空为面议" />
          <van-field v-model="form.price_unit" label="单位" placeholder="个/米/套" />
          <van-cell title="是否发布" center>
            <template #value><van-switch v-model="form.is_published" /></template>
          </van-cell>
          <van-cell title="封面图">
            <template #value>
              <ImageUploader v-model="coverPaths" folder="parts" :max="1" />
            </template>
          </van-cell>
          <van-cell title="图集">
            <template #value>
              <ImageUploader v-model="galleryPaths" folder="parts" :max="9" />
            </template>
          </van-cell>
          <van-field
            v-model="specsText"
            label="规格(JSON)"
            type="textarea"
            rows="3"
            placeholder='{"材质":"棉"}'
          />
        </van-cell-group>
        <div class="flex gap-3 mt-4">
          <van-button block @click="showForm = false">取消</van-button>
          <van-button block type="primary" @click="save">保存</van-button>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showCatPicker" position="bottom" round>
      <van-picker
        :columns="catOptions"
        @confirm="onCatConfirm"
        @cancel="showCatPicker = false"
      />
    </van-popup>
  </div>
</template>
