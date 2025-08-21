<script setup lang="ts">
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { type News } from '@/types'
import NewsService from '@/services/NewsService'

const props = defineProps<{
  news: News
  id: string
}>()

const { news } = toRefs(props)
const router = useRouter()
const store = useMessageStore()

// ✅ Existing register function
const register = () => {
  store.updateMessage('You are successfully registered for ' + props.news.topic)
  setTimeout(() => {
    store.resetMessage()
  }, 3000)
  router.push({ name: 'news-detail-view', params: { id: props.news.id } })
}

// ✅ New vote function
async function vote(isTrue: boolean) {
  if (!news.value) return

  if (isTrue) {
    news.value.trueVotes++
  } else {
    news.value.falseVotes++
  }

  try {
    await NewsService.voteNews(
      news.value.id,
      news.value.trueVotes,
      news.value.falseVotes
    )
  } catch (error) {
    console.error('Vote failed', error)
  }
}
</script>

<template>
  <div>
    <!-- Keep register functionality -->
    <p>Register news here</p>
    <button @click="register" class="btn-primary">Register</button>

    <!-- Add voting UI -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold">Vote on this news</h2>
      <button @click="vote(true)" class="px-4 py-2 bg-green-500 text-white rounded mr-2">
        Vote True
      </button>
      <button @click="vote(false)" class="px-4 py-2 bg-red-500 text-white rounded">
        Vote False
      </button>

      <p class="mt-4">True Votes: {{ news.trueVotes }}</p>
      <p>False Votes: {{ news.falseVotes }}</p>
      <p>
        Verdict:
        <strong>
          {{ news.trueVotes > news.falseVotes ? "Mostly True" : "Mostly False" }}
        </strong>
      </p>
    </div>
  </div>
</template>
