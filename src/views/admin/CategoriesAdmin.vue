<script setup lang="ts">
import { ref } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import { useCategories } from '@/composables/useCategories'
import type { Category, CategoryInput } from '@/types'

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

function resetForm() {
  form.value = {
    name: '',
    slug: '',
    parent_id: null,
    sort_order: 0,
    is_active: true,
  }
  editingId.value = null
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

function openEdit(cat: Category) {
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
  showForm.value = true
}

const parentText = () =>
  parentOptions.value.find((o) => o.value === form.value.parent_id)?.text || '无'

async function save() {
  if (!form.value.name || !form.value.slug) {
    showToast('请填写名称和 slug')
    return
  }
  try {
    if (editingId.value) {
      await update(editingId.value, form.value)
      showToast('已更新')
    } else {
      await add(form.value)
      showToast('已添加')
    }
    showForm.value = false
    await load()
  } catch (e: unknown) {
    showToast((e as { message?: string })?.message || '保存失败')
  }
}

async function onDelete(cat: Category) {
  await showConfirmDialog({
    title: '删除分类',
    message: `确认删除「${cat.name}」？`,
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
      :style="{ height: '80%' }"
    >
      <div class="p-4">
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
