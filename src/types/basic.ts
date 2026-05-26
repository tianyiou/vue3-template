// 列表，后端返回结果
export type BaseListResult<T, K extends string = 'page_data'> = {
  [key in K]: T[]
} & {
  total_count: number
}
