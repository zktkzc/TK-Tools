const Store = require('electron-store').default

console.log(Store)

const store = new Store()

const setData = (key: string, value: any) => {
  store.set(key, value)
}
const getData = (key: string) => {
  return store.get(key)
}

export { setData, getData }
