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
  return {
    userInfo: {
      avatar: process.env.SITE_AVATAR || 'https://g.lingman.tech/app/lmapp/dev/uploadfiles/20230710/nSyz3hCGbpJ6shG6MxeY3J2DnAYJt62m.jpeg',
      name: process.env.SITE_NAME ||  '字格',
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
