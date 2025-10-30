<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { News } from '@/types'
import NewsService from '@/services/NewsService'
import BaseInput from '@/components/BaseInput.vue'
import ImageUpload from '@/components/ImageUpload.vue'

// Initialize a new news item
const news = ref<News>({
  id: null,
  topic: '',
  shortDetail: '',
  longDetail: '',
  trueVotes: 0,
  falseVotes: 0,
  reporter: null as any,
  date: '',
  time: '',
  comments: [],
  images: []
})

const router = useRouter()

// Function to save news
function saveNews() {
  NewsService.saveNews(news.value)
    .then((response) => {
      router.push({ name: 'news-detail-view', params: { id: response.data.id } })
    })
    .catch((err) => {
      console.error(err)
      router.push({ name: 'network-error-view' })
    })
}
</script>

<style scoped>
/* reuse your existing styling for input fields and buttons */
.field {
  margin-bottom: 24px;
  box-sizing: border-box;
  border: solid 1px rgba(0, 0, 0, 0.4);
  height: 50px;
  width: 95%;
  padding: 0 10px;
  font-size: 20px;
}
.field:focus {
  border-color: #39b982;
  outline: none;
}
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 40px;
  background: #38c789;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s linear;
}
button:hover {
  transform: scale(1.02);
  background: #16d180;
}
button:active { transform: scale(1); }
button:focus { outline: none; }
</style>

<template>
  <div>
    <h1>Create a News Item</h1>
    <form @submit.prevent="saveNews">
      <BaseInput v-model="news.topic" type="text" label="Topic" />
      <BaseInput v-model="news.shortDetail" type="text" label="Short Detail" />
      <BaseInput v-model="news.longDetail" type="text" label="Long Detail" />
      <BaseInput v-model="news.date" type="date" label="Date" />
      <BaseInput v-model="news.time" type="time" label="Time" />
      
      <h3>The image of the Event</h3>
      <ImageUpload v-model="news.images" />

      <button type="submit">Submit</button>
    </form>

    <pre>{{ news }}</pre>
  </div>
</template>
