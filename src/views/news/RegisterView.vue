<script setup lang="ts">
import { ref, computed, toRefs, onMounted } from 'vue'
import { type News } from '@/types'
import NewsService from '@/services/NewsService'

const props = defineProps<{ news: News; id: string }>()
const { news } = toRefs(props)

const commentText = ref('')
const filter = ref<'all' | 'true' | 'false'>('all')

const votedKey = computed(() => `voted:${news.value?.id}`)
const hasVoted = ref(false)

// const commentImageUrl = ref('')

const selectedFile = ref<File | null>(null)

onMounted(() => {
  hasVoted.value = localStorage.getItem(votedKey.value) === '1'
  if (!news.value?.comments) news.value!.comments = []
})

const filteredComments = computed(() => {
  if (!news.value?.comments) return []
  if (filter.value === 'all') return news.value.comments
  return news.value.comments.filter(c => c.vote === filter.value)
})

async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file) // produces "data:image/png;base64,..."
  })
}

async function submitComment(vote: 'true' | 'false') {
  if (!news.value || hasVoted.value || !commentText.value.trim()) return

  let imageUrl: string | undefined
  if (selectedFile.value) {
    imageUrl = await uploadImage(selectedFile.value)
  }

  const res = await NewsService.addComment({
    newsId: news.value.id,
    text: commentText.value.trim(),
    vote,
    imageUrl
  })

  news.value.comments!.unshift(res.data)

  if (vote === 'true') news.value.trueVotes++
  else news.value.falseVotes++
  await NewsService.voteNews(news.value.id, news.value.trueVotes, news.value.falseVotes)

  localStorage.setItem(votedKey.value, '1')
  hasVoted.value = true
  commentText.value = ''
  selectedFile.value = null
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}
</script>

<template>
  <div class="max-w-md w-full bg-white shadow-md rounded-2xl p-6 border border-gray-200 mx-auto mt-6">
    <!-- Header -->
    <h2 class="text-lg font-semibold mb-4 text-gray-800">Comment & Vote</h2>

    <!-- Comment input -->
    <textarea
      v-model="commentText"
      placeholder="Add your comment..."
      rows="3"
      class="w-full border border-gray-300 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />

    <input
      type="file"
      accept="image/*"
      @change="onFileSelected"
      class="mb-4"
    />

    <!-- Submit buttons -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
      <button
        @click="submitComment('true')"
        :disabled="hasVoted || !commentText.trim()"
        class="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit as True
      </button>
      <button
        @click="submitComment('false')"
        :disabled="hasVoted || !commentText.trim()"
        class="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit as False
      </button>
      <span v-if="hasVoted" class="text-sm text-gray-500 mt-2 sm:mt-0">You’ve already voted on this news.</span>
    </div>

    <!-- Vote tally -->
    <div class="bg-gray-50 rounded-lg p-4 text-sm mb-6">
      <p class="text-green-700 font-semibold">True Votes: {{ news.trueVotes }}</p>
      <p class="text-red-700 font-semibold">False Votes: {{ news.falseVotes }}</p>
      <p class="mt-2">
        Verdict:
        <span class="font-bold" :class="news.trueVotes > news.falseVotes ? 'text-green-600' : 'text-red-600'">
          {{ news.trueVotes > news.falseVotes ? 'Mostly True' : 'Mostly False' }}
        </span>
      </p>
    </div>

    <!-- Filter buttons -->
    <div class="flex gap-2 mb-4">
      <button
        class="px-3 py-1 border rounded-lg"
        :class="{ 'font-semibold bg-gray-100': filter==='all' }"
        @click="filter='all'"
      >
        All
      </button>
      <button
        class="px-3 py-1 border rounded-lg"
        :class="{ 'font-semibold bg-gray-100': filter==='true' }"
        @click="filter='true'"
      >
        True
      </button>
      <button
        class="px-3 py-1 border rounded-lg"
        :class="{ 'font-semibold bg-gray-100': filter==='false' }"
        @click="filter='false'"
      >
        False
      </button>
    </div>

    <!-- Comment list -->
    <ul class="space-y-3">
      <li v-for="c in filteredComments" :key="c.id" class="flex items-start gap-3 border-b pb-3">
        <!-- Vote badge -->
        <span
          :class="c.vote==='true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          class="font-bold px-2 py-1 rounded-full text-sm flex-shrink-0"
        >
          {{ c.vote === 'true' ? 'True' : 'False' }}
        </span>

        <!-- Comment content -->
        <div class="flex-1">
          <p class="text-gray-800">{{ c.text }}</p>
          <img
            v-if="c.imageUrl"
            :src="c.imageUrl"
            alt="Comment image"
            class="mt-2 max-h-40 rounded-lg object-cover border"
          />
          <span class="text-xs text-gray-500 mt-1 block">{{ new Date(c.createdAt).toLocaleString() }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
