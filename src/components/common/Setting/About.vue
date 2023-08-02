<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import { fetchChatConfig } from '@/api'
// import pkg from '@/../package.json'
// import { useAuthStore } from '@/store'

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

// const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()

// const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <br>
      <audio controls>
        <source src="https://api-lmapp.lingman.tech/api/Public/download/https%3A%2F%2Ffanyi.baidu.com%2Fgettts%3Flan%3Dzh%26text%3D%25E6%25AC%25A2%25E8%25BF%258E%25E4%25BD%25BF%25E7%2594%25A8chat%2520gpt%26spd%3D5%26source%3Dweb" type="audio/mpeg">

        Your browser does not support this audio format.
      </audio>
    </div>
  </NSpin>
</template>
