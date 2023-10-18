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
        <source src="https://git.lingman.tech:9000/lmo/software/20230806/chatgpt.mp3" type="audio/mpeg">
        Your browser does not support this audio format.
      </audio>
    </div>
  </NSpin>
</template>
