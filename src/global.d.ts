declare module '*.cast' {
  const content: any
  export default content
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.mp3' {
  const content: any
  export default content
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Window {
  Terminal: any
}
