import { defineStore } from 'pinia'
import {
  GenerateCharacterDataType,
  GenerateUUIDDataType,
  HashCalcDataType,
  JsonToolDataType
} from '../../../types'

export const useDataStore = defineStore('data', {
  state: () => {
    return {
      data: {
        json_tool: {} as JsonToolDataType,
        hash_calc: {} as HashCalcDataType,
        gen_ch: {} as GenerateCharacterDataType,
        gen_uuid: {} as GenerateUUIDDataType
      }
    }
  },
  actions: {
    setData(key: string, value: any): void {
      this.data[key] = { ...this.data[key], ...value }
    },
    getData(key: string): any {
      return this.data[key]
    }
  },
  persist: {
    key: 'data',
    storage: localStorage
  }
})
