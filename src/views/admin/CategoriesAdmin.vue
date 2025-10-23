<script setup lang="ts">
import { ref } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import { useCategories } from '@/composables/useCategories'
import {
  fetchCategoryTiers,
  createCategoryTier,
  updateCategoryTier,
  deleteCategoryTier,
  seedDefaultCategoryTiers,
} from '@/api/categoryTiers'
import type { Category, CategoryInput, CategoryTier } from '@/types'

const { categories, load, add, update, remove } = useCategories()

const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref<CategoryInput>({
  name: '',
  slug: '',
  parent_id: null,
  sort_order: 0,
  is_active: true,
})

const showParentPicker = ref(false)
const parentOptions = ref<Array<{ text: string; value: number | null }>>([])

// 类别档位（质量档位）编辑态
interface TierDraft {
  id?: number
  code: string
  name: string
  sort_order: number
  is_visible: boolean
}
const catTiers = ref<TierDraft[]>([])
const originalTierIds = ref<number[]>([])

function resetForm() {
  form.value = {
    name: '',
    slug: '',
    parent_id: null,
    sort_order: 0,
    is_active: true,
  }
  editingId.value = null
  catTiers.value = []
  originalTierIds.value = []
}

function openCreate() {
  resetForm()
  parentOptions.value = [
    { text: '无（顶级分类）', value: null },
    ...categories.value
      .filter((c) => c.id !== editingId.value)
      .map((c) => ({ text: c.name, value: c.id })),
  ]
  showForm.value = true
}

async function openEdit(cat: Category) {
  editingId.value = cat.id
  form.value = {
    name: cat.name,
    slug: cat.slug,
    parent_id: cat.parent_id,
    sort_order: cat.sort_order,
    is_active: cat.is_active,
  }
  parentOptions.value = [
    { text: '无（顶级分类）', value: null },
    ...categories.value
      .filter((c) => c.id !== cat.id)
      .map((c) => ({ text: c.name, value: c.id })),
  ]
  // 载入该类别的档位
  try {
    const tiers = await fetchCategoryTiers(cat.id, { includeHidden: true })
    catTiers.value = tiers.map((t: CategoryTier) => ({
      id: t.id,
      code: t.code,
      name: t.name,
      sort_order: t.sort_order,
      is_visible: t.is_visible,
    }))
  } catch {
    catTiers.value = []
  }
  originalTierIds.value = catTiers.value.map((t) => t.id!).filter(Boolean)
  showForm.value = true
}

const parentText = () =>
  parentOptions.value.find((o) => o.value === form.value.parent_id)?.text || '无'

async function syncTiers(categoryId: number) {
  const keptIds = catTiers.value
    .filter((t) => t.code && t.name)
    .map((t) => t.id!)
    .filter(Boolean)
  for (const id of originalTierIds.value) {
    if (!keptIds.includes(id)) await deleteCategoryTier(id)
  }
  for (let i = 0; i < catTiers.value.length; i++) {
    const t = catTiers.value[i]
    if (!t.code || !t.name) continue
    const payload = {
      category_id: categoryId,
      code: t.code,
      name: t.name,
      sort_order: i,
      is_visible: t.is_visible,
    }
    if (t.id) await updateCategoryTier(t.id, payload)
    else await createCategoryTier(payload)
  }
}

async function save() {
  if (!form.value.name || !form.value.slug) {
    showToast('请填写名称和 slug')
    return
  }
  try {
    let catId = editingId.value
    if (catId) {
      await update(catId, form.value)
      showToast('已更新')
    } else {
      const created = await add(form.value)
      catId = created.id
      showToast('已添加，可继续设置档位')
    }
    if (catId != null) await syncTiers(catId)
    showForm.value = false
    await load()
  } catch (e: unknown) {
    showToast((e as { message?: string })?.message || '保存失败')
  }
}

async function onDelete(cat: Category) {
  await showConfirmDialog({
    title: '删除分类',
    message: `确认删除「${cat.name}」？其下档位将一并删除。`,
  })
  try {
    await remove(cat.id)
    showToast('已删除')
  } catch (e: unknown) {
    showToast((e as { message?: string })?.message || '删除失败')
  }
}

function onParentConfirm({ selectedValues }: { selectedValues: (number | null)[] }) {
  form.value.parent_id = selectedValues[0] ?? null
  showParentPicker.value = false
}

function addTier() {
  catTiers.value.push({
    code: '',
    name: '',
    sort_order: catTiers.value.length,
    is_visible: true,
  })
}
function removeTier(i: number) {
  catTiers.value.splice(i, 1)
}
async function seedDefaults() {
  if (!editingId.value) {
    showToast('请先保存分类后再生成默认档位')
    return
  }
  try {
    await seedDefaultCategoryTiers(editingId.value)
    const tiers = await fetchCategoryTiers(editingId.value, { includeHidden: true })
    catTiers.value = tiers.map((t: CategoryTier) => ({
      id: t.id,
      code: t.code,
      name: t.name,
      sort_order: t.sort_order,
      is_visible: t.is_visible,
    }))
    originalTierIds.value = catTiers.value.map((t) => t.id!).filter(Boolean)
    showToast('已生成默认三档')
  } catch (e: unknown) {
    showToast((e as { message?: string })?.message || '生成失败')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold">分类管理</h2>
      <van-button size="small" type="primary" @click="openCreate">
        新增分类
      </van-button>
    </div>

    <div v-if="categories.length === 0" class="text-sm text-gray-400 mt-6">
      暂无分类
    </div>

    <div
      v-for="c in categories"
      :key="c.id"
      class="card flex items-center justify-between p-3 mb-2"
    >
      <div>
        <div class="text-sm font-medium">{{ c.name }}</div>
        <div class="text-xs text-gray-400 mt-0.5">
          /{{ c.slug }} · 排序 {{ c.sort_order }}
          <span :class="c.is_active ? 'text-green-600' : 'text-red-500'">
            · {{ c.is_active ? '启用' : '禁用' }}
          </span>
          <span v-if="c.category_tiers?.length" class="ml-1">
            · {{ c.category_tiers.length }} 档
          </span>
        </div>
      </div>
      <div class="flex gap-2">
        <van-button size="mini" plain @click="openEdit(c)">编辑</van-button>
        <van-button size="mini" plain type="danger" @click="onDelete(c)">
          删除
        </van-button>
      </div>
    </div>

    <!-- 表单弹窗 -->
    <van-popup
      v-model:show="showForm"
      position="bottom"
      round
      :style="{ height: '88%' }"
    >
      <div class="p-4 overflow-y-auto" style="max-height: 88vh">
        <h3 class="text-base font-semibold mb-3">
          {{ editingId ? '编辑分类' : '新增分类' }}
        </h3>
        <van-cell-group inset>
          <van-field v-model="form.name" label="名称" placeholder="如：导轨" />
          <van-field
            v-model="form.slug"
            label="slug"
            placeholder="英文标识，如 gui-dao"
          />
          <van-cell
            title="上级分类"
            :value="parentText()"
            is-link
            @click="showParentPicker = true"
          />
          <van-field v-model="form.sort_order" type="number" label="排序" />
          <van-cell title="是否启用" center>
            <template #value>
              <van-switch v-model="form.is_active" />
            </template>
          </van-cell>
        </van-cell-group>

        <!-- 类别质量档位管理 -->
        <div class="card p-3 mt-3">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium">质量档位（按类别区分）</div>
            <van-button size="mini" type="primary" plain @click="seedDefaults">
              一键默认档位
            </van-button>
          </div>
          <div class="text-[11px] text-gray-400 mb-2">
            每个类别可自定义档位（如经济/标准/豪华），并可单独控制是否在前台显示。
          </div>
          <div
            v-for="(d, i) in catTiers"
            :key="i"
            class="border border-gray-100 rounded-lg p-2 mb-2"
          >
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex-1 flex gap-1.5">
                <van-field v-model="d.code" label="编码" placeholder="economy" class="!p-0" />
                <van-field v-model="d.name" label="名称" placeholder="经济款" class="!p-0" />
              </div>
              <van-button size="mini" plain type="danger" @click="removeTier(i)">删</van-button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">前台显示</span>
              <van-switch v-model="d.is_visible" />
            </div>
          </div>
          <div v-if="!catTiers.length" class="text-xs text-gray-400">
            暂无档位，可点「一键默认档位」生成经济/标准/豪华，或手动添加。
          </div>
          <van-button size="mini" plain class="mt-2" @click="addTier">
            + 添加档位
          </van-button>
        </div>

        <div class="flex gap-3 mt-4">
          <van-button block @click="showForm = false">取消</van-button>
          <van-button block type="primary" @click="save">保存</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 上级分类选择 -->
    <van-popup v-model:show="showParentPicker" position="bottom" round>
      <van-picker
        :columns="parentOptions"
        @confirm="onParentConfirm"
        @cancel="showParentPicker = false"
      />
    </van-popup>
  </div>
</template>
