<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import ImageUpload from '@/components/ImageUpload.vue' // ✅ added
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useField, useForm } from 'vee-validate'
import { useMessageStore } from '@/stores/message'
import { useRouter } from 'vue-router'
import { ref } from 'vue' // ✅ added

const authStore = useAuthStore()
const messageStore = useMessageStore()
const router = useRouter()

const validationSchema = yup.object({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().required('Email is required').email('Must be a valid email'),
  password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
})

const { errors, handleSubmit } = useForm({ validationSchema })

const { value: firstname } = useField<string>('firstname')
const { value: lastname } = useField<string>('lastname')
const { value: username } = useField<string>('username')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')

const profileImage = ref<string[]>([]) // ✅ added for uploaded image URLs

const onSubmit = handleSubmit(async (values) => {
  try {
    const result = await authStore.register(
      values.firstname,
      values.lastname,
      values.username,
      values.email,
      values.password,
      profileImage.value[0] || null // ✅ send the uploaded image (first one)
    )
    messageStore.updateMessage(result.message || 'Registration successful!')

    setTimeout(() => {
      messageStore.resetMessage()
      router.push({ name: 'login' })
    }, 1500)
  } catch (err) {
    console.error(err)
    messageStore.updateMessage('Registration failed. Please try again.')
    setTimeout(() => messageStore.resetMessage(), 3000)
  }
})
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">First Name</label>
          <InputText v-model="firstname" type="text" :error="errors['firstname']" />
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
          <InputText v-model="lastname" type="text" :error="errors['lastname']" />
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Username</label>
          <InputText v-model="username" type="text" :error="errors['username']" />
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <InputText v-model="email" type="text" :error="errors['email']" />
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <InputText v-model="password" type="password" :error="errors['password']" />
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
          <InputText v-model="confirmPassword" type="password" :error="errors['confirmPassword']" />
        </div>

        <!-- ✅ Profile image upload -->
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Profile Image</label>
          <ImageUpload v-model="profileImage" />
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5
            text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-indigo-600"
          >
            Register
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already have an account?
        <a @click.prevent="router.push({ name: 'login' })"
           class="cursor-pointer font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Sign in here
        </a>
      </p>
    </div>
  </div>
</template>
