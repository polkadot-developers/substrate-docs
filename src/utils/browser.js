import { browserName, browserVersion } from 'react-device-detect'

export const isBrowser = typeof window !== 'undefined'

export const browser = { name: browserName, version: browserVersion }

export const isSafari = browserName === 'Safari'
