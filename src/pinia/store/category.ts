import { defineStore } from 'pinia'

const menuModal = [
  {
    title: '校区',
    type: 'location',
    list: ['广州校区', '清远校区', '肇庆校区']
  },
  // { title: '年级', type: '', list: ['大一', '大二', '大三', '大四', '专升本']},
  {
    title: '活动类型',
    type: 'type',
    list: ['二课综测', '二课', '综测']
  },
  {
    title: '学分类型',
    type: 'creditType',
    list: ['思想成长', '文体活动', '实践实习', '创新创业', '志愿公益', '技能特长', '菁英成长']
  },
  {
    title: '活动状态',
    type: 'status',
    list: ['未开始', '进行中', '已结束']
  },
  {
    title: '参与渠道',
    type: 'channel',
    list: ['线上', '线下']
  },
  // { title: '证书', list: ['四六级', '雅思托福', '计算机等级证书', '教资', '普通话', '会计', '证券从业资格证']},
  {
    title: '院系',
    type: 'targetAudience',
    list: ['金融与投资学院', '工商管理学院', '大数据与人工智能学院', '金融数学与统计学院', '计算机学院', '保险学院', '法学院', '心理与创业教育学院', '经济贸易学院', '外国语言与文化学院', '国际教育学院', '国家金融学学院', '财经与新媒体学院', '会计学院']
  }
]
export interface CategoryMenuItem {
  title: string
  list: string[]
  choose: boolean[]
  choosenum: number
}

export interface CategoryState {
  topClassifyIndex: number
  menu: CategoryMenuItem[]
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    topClassifyIndex: 0,
    menu: menuModal.map((item) => {
      return {
        title: item.title,
        list: ['全部', ...item.list],
        type: item.type,
        choose: Array.from({ length: item.list.length + 1 }, (_v, i) => i === 0),
        choosenum: 0
      }
    })
  }),
  actions: {
    setTopClassifyIndex(idx: number) {
      this.topClassifyIndex = idx
    },
    setMenu(menu: CategoryMenuItem[]) {
      this.menu = menu
    },
    resetMenu() {
      this.menu = menuModal.map((item) => {
        return {
          title: item.title,
          list: ['全部', ...item.list],
          type: item.type,
          choose: Array.from({ length: item.list.length + 1 }, (_v, i) => i === 0),
          choosenum: 0
        }
      })
    }
  },
  persist: true
})
