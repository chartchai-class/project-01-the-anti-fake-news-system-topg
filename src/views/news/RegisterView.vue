<script setup lang="ts">
import { ref, computed, toRefs, onMounted } from 'vue'
import { type News } from '@/types'
import NewsService from '@/services/NewsService'

const props = defineProps<{ news: News; id: string }>()
const { news } = toRefs(props)

const commentText = ref('')
const filter = ref<'all' | 'true' | 'false'>('all')

// one vote per news per browser (simple POC using localStorage)
const votedKey = computed(() => `voted:${news.value?.id}`)
const hasVoted = ref(false)

onMounted(() => {
  hasVoted.value = localStorage.getItem(votedKey.value) === '1'
  // ensure comments array exists when using _embed
  if (!news.value?.comments) news.value!.comments = []
})

const filteredComments = computed(() => {
  if (!news.value?.comments) return []
  if (filter.value === 'all') return news.value.comments
  return news.value.comments.filter(c => c.vote === filter.value)
})

async function submitComment(vote: 'true' | 'false') {
  if (!news.value) return
  if (!commentText.value.trim() || hasVoted.value) return

  // 1) create comment in /comments
  const res = await NewsService.addComment({
    newsId: news.value.id,
    text: commentText.value.trim(),
    vote
  })
  // push locally so UI updates without reloading
  news.value.comments!.unshift(res.data)

  // 2) update aggregate votes on /news (optional but matches your current UI)
  if (vote === 'true') news.value.trueVotes++
  else news.value.falseVotes++
  await NewsService.voteNews(news.value.id, news.value.trueVotes, news.value.falseVotes)

  // 3) lock further votes for this user (simple localStorage lock)
  localStorage.setItem(votedKey.value, '1')
  hasVoted.value = true
  commentText.value = ''
}
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-2">Comment & Vote</h2>

    <textarea
      v-model="commentText"
      placeholder="Add your comment..."
      class="w-full border rounded p-2 mb-3"
      rows="3"
    />

    <div class="flex items-center gap-2 mb-4">
      <button
        @click="submitComment('true')"
        :disabled="hasVoted || !commentText.trim()"
        class="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        Submit as True
      </button>
      <button
        @click="submitComment('false')"
        :disabled="hasVoted || !commentText.trim()"
        class="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
      >
        Submit as False
      </button>
      <span v-if="hasVoted" class="text-sm text-gray-600">You’ve already voted on this news.</span>
    </div>

    <div class="mt-2">
      <p>True Votes: {{ news.trueVotes }} | False Votes: {{ news.falseVotes }}</p>
      <p>
        Verdict:
        <strong>{{ news.trueVotes > news.falseVotes ? 'Mostly True' : 'Mostly False' }}</strong>
      </p>
    </div>

    <div class="mt-6">
      <div class="flex gap-2 mb-3">
        <button class="px-3 py-1 border rounded" :class="{ 'font-semibold': filter==='all' }" @click="filter='all'">All</button>
        <button class="px-3 py-1 border rounded" :class="{ 'font-semibold': filter==='true' }" @click="filter='true'">True</button>
        <button class="px-3 py-1 border rounded" :class="{ 'font-semibold': filter==='false' }" @click="filter='false'">False</button>
      </div>

      <ul>
        <li v-for="c in filteredComments" :key="c.id" class="border-b py-2">
          <span :class="c.vote==='true' ? 'text-green-700' : 'text-red-700'" class="font-semibold">
            [{{ c.vote === 'true' ? 'True' : 'False' }}]
          </span>
          {{ c.text }}
          <span class="text-xs text-gray-500 ml-2">{{ new Date(c.createdAt).toLocaleString() }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
