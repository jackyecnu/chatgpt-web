import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  avatar: string
  name: string
  description: string
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  const avatar = 'https://g.lingman.tech/app/lmapp/dev/uploadfiles/20230711/xbWZztrKESFs3njFn2dCJktT67MzfBHN.png'
  const name = 'Chatgpt'

  return {
    userInfo: {
      avatar: window.SITE_AVATAR || avatar,
      name: window.SITE_NAME || name,
      description: '',
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
