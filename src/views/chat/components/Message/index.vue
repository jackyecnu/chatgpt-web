<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NDropdown, useMessage } from 'naive-ui'
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'
import { SvgIcon } from '@/components/common'
import { useIconRender } from '@/hooks/useIconRender'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { copyToClip } from '@/utils/copy'

interface Props {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}

interface Emit {
  (ev: 'regenerate'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

const { iconRender } = useIconRender()

const message = useMessage()

const textRef = ref<HTMLElement>()

const asRawText = ref(props.inversion)

const messageRef = ref<HTMLElement>()

const options = computed(() => {
  const common = [
    {
      label: '播放',
      key: 'play',
      icon: iconRender({ icon: 'carbon:play-outline' }),
    },
    {
      label: '分段播放',
      key: 'segmentPlay',
      icon: iconRender({ icon: 'carbon:play-outline' }),
    },
    {
      label: t('chat.copy'),
      key: 'copyText',
      icon: iconRender({ icon: 'ri:file-copy-2-line' }),
    },
    {
      label: t('common.delete'),
      key: 'delete',
      icon: iconRender({ icon: 'ri:delete-bin-line' }),
    },
  ]

  if (!props.inversion) {
    common.unshift({
      label: asRawText.value ? t('chat.preview') : t('chat.showRawText'),
      key: 'toggleRenderType',
      icon: iconRender({ icon: asRawText.value ? 'ic:outline-code-off' : 'ic:outline-code' }),
    })
  }

  return common
})

function handleSelect(key: 'copyText' | 'delete' | 'toggleRenderType' | 'play' | 'segmentPlay') {
  switch (key) {
    case 'copyText':
      handleCopy()
      return
    case 'toggleRenderType':
      asRawText.value = !asRawText.value
      return
    case 'delete':
      emit('delete')
      return
    case 'play':
      handlePlay()
      return
    case 'segmentPlay':
      handleSegmentPlay()
  }
}

function handleRegenerate() {
  messageRef.value?.scrollIntoView()
  emit('regenerate')
}

async function handleCopy() {
  try {
    await copyToClip(props.text || '')
    message.success('复制成功')
  }
  catch {
    message.error('复制失败')
  }
}

async function handleSegmentPlay() {
  const zhText = props.text || ''

  const audioList = [] as HTMLAudioElement[]
  const zhTextArr = zhText.match(/[\s\S]{1,100}/g)

  if (zhTextArr) {
    for (const text of zhTextArr) {
      const audio = await loadAudioByText(text)
      audioList.push(audio as HTMLAudioElement)
    }
  }

  for (const item of audioList)
    await Play(item)
}

async function handlePlay() {
  let zhText = props.text || ''
  zhText = encodeURI(zhText)

  const mp3Src = `https://api-lmapp.lingman.tech/api/Public/download/${encodeURIComponent(`https://fanyi.baidu.com/gettts?lan=zh&text=${zhText}&spd=5&source=web`)}`

  new Audio(mp3Src).play()
}

async function loadAudioByText(text: string) {
  return new Promise((resolve) => {
    const audio = new Audio(`https://api-lmapp.lingman.tech/api/Public/download/${encodeURIComponent(`https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURI(text)}&spd=5&source=web`)}`)
    audio.addEventListener('canplaythrough', async () => {
      // await new Promise(resolve => setTimeout(resolve, 5000))
      resolve(audio)
    })
  })
}

async function Play(audio: HTMLAudioElement) {
  return new Promise((resolve) => {
    audio.play()
    audio.addEventListener('ended', () => {
      resolve('播放结束')
    })
  })
}
</script>

<template>
  <div ref="messageRef" class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': inversion }]">
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <AvatarComponent :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm " :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div class="flex items-end gap-1 mt-2" :class="[inversion ? 'flex-row-reverse' : 'flex-row']">
        <TextComponent
          ref="textRef" :inversion="inversion" :error="error" :text="text" :loading="loading"
          :as-raw-text="asRawText"
        />
        <div class="flex flex-col">
          <button
            v-if="!inversion"
            class="mb-2 transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
            @click="handleRegenerate"
          >
            <SvgIcon icon="ri:restart-line" />
          </button>
          <NDropdown
            :trigger="isMobile ? 'click' : 'hover'" :placement="!inversion ? 'right' : 'left'" :options="options"
            @select="handleSelect"
          >
            <button class="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200">
              <SvgIcon icon="ri:more-2-fill" />
            </button>
          </NDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
