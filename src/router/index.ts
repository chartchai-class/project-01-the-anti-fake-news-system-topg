import { createRouter, createWebHistory } from 'vue-router'
import NewsListView from '@/views/NewsListView.vue'
import NewsDetailView from '@/views/news/DetailView.vue'
import NewsVoteView from '@/views/news/VoteView.vue'
import NewsCommentView from '@/views/news/CommentView.vue'
import NewsLayoutView from '@/views/news/LayoutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NetworkErrorView from '@/views/NetworkErrorView.vue'
import nProgress from 'nprogress'
import NewsService from '@/services/NewsService'
import { useNewsStore } from '@/stores/News'
import AddNewsView from '@/views/NewsFormView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminUsersView from '@/views/AdminUsers.vue'
import ProfileView from '@/views/ProfileView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'news-list-view',
      component: NewsListView,
      props: (route) => ({
        page: parseInt(route.query.page?.toString() || '1'),
        size: parseInt(route.query.size?.toString() || '3'),
      }),
     },

   {

     path: '/login',
     name: 'login',
     component: LoginView

   },
   {
      path: '/register',
      name: 'register-view',
      component: () => import('@/views/RegisterView.vue')
   },
   {
      path: '/news/:id',
      name: 'news-layout-view',
      component: NewsLayoutView,
      props: true,
      beforeEnter: (to) => {
        const id = parseInt(to.params.id as string)
        const newsStore = useNewsStore()
        return NewsService.getNewsItem(id)
          .then((response) => {
            newsStore.setNews(response.data)
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              return {
                name: '404-resource-view',
                params: { resource: 'news' },
              }
            } else {
              return { name: 'network-error-view' }
            }
          })
      },
      children: [
        {
          path: '',
          name: 'news-detail-view',
          component: NewsDetailView,
          props: true,
        },
        {
          path: 'vote',
          name: 'news-vote-view',
          component: NewsVoteView,
          props: true,
        },
        {
          path: 'comment',
          name: 'news-comment-view',
          component: NewsCommentView,
          props: true,
        }
      ],
    },
    {
      path: '/add-news',
      name: 'add-news',
      component: AddNewsView,
    },
    {
      path: '/network-error',
      name: 'network-error-view',
      component: NetworkErrorView,
    },
    {
      path: '/404/:resource',
      name: '404-resource-view',
      component: NotFoundView,
      props: true,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
    },{ 
      path: '/profile',
      name: 'profile',
      component: ProfileView 
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})
export default router
