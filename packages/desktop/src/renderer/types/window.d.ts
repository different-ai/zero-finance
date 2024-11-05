import type { API } from '../../preload'
import type { VaultConfig } from '../types'

declare global {
  interface Window {
    api: API;
  }
}

export {} 