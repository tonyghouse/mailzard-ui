import { Template } from "./Template"



export interface TemplatePage {
  content: Template[]
  totalPages: number
  totalElements: number
  number: number // current page
  size: number
  first: boolean
  last: boolean
}
