const modules = import.meta.glob('../assets/images/Product/**/*.{jpg,png,JPG,PNG}', { eager: true })

export const imageMap = {}
for (const [path, mod] of Object.entries(modules)) {
  const filename = path.split('/').pop()
  imageMap[filename] = mod.default
}

const detailModules = import.meta.glob('../assets/images/Product/detail/*/*.{jpg,png,JPG,PNG}', { eager: true })

export function resolveDetailImages(jsonPath) {
  if (!jsonPath) return []
  const folder = jsonPath.split('/').pop().replace(/\.[^.]+$/, '')
  return Object.entries(detailModules)
    .filter(([path]) => path.includes(`/detail/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, mod]) => mod.default)
}

export function resolveImage(jsonPath) {
  if (!jsonPath) return ''
  const filename = jsonPath.split('/').pop()
  return imageMap[filename] ?? jsonPath
}

export function resolvePlainImage(jsonPath) {
  if (!jsonPath) return ''
  const filename = jsonPath.split('/').pop()
  const plain = filename.replace(/_color_(\d+)(\.[^.]+)$/, '_$1$2')
  if (plain !== filename) {
    const withPng = plain.replace(/\.\w+$/, '.png')
    const withJpg = plain.replace(/\.\w+$/, '.jpg')
    if (imageMap[plain])    return imageMap[plain]
    if (imageMap[withPng])  return imageMap[withPng]
    if (imageMap[withJpg])  return imageMap[withJpg]
  }
  return imageMap[filename] ?? jsonPath
}
