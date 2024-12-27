export interface AwesomeItem {
  name: string
  url: string
  description: string
}

export interface AwesomeCategory {
  name: string
  items: AwesomeItem[]
}

export interface AwesomeList {
  categories: AwesomeCategory[]
}

