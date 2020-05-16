import Vue from 'vue'
import {
  Button, Form, Field, Notify, Tabbar, TabbarItem, NavBar, Toast,
  Cell, CellGroup, Grid, GridItem, Icon, DropdownMenu, DropdownItem,
  Search, Checkbox, CheckboxGroup, Uploader, Overlay, Loading
  , Dialog, Switch, PullRefresh, DatetimePicker, ActionSheet, Image as VanImage
  , List, Popup
} from 'vant'

Vue.use(Popup)
Vue.use(List)
Vue.use(VanImage)
Vue.use(ActionSheet)
Vue.use(DatetimePicker)
Vue.use(PullRefresh)
Vue.use(Switch)
// 全局注册
Vue.use(Dialog)
Vue.use(Loading)
Vue.use(Overlay)
Vue.use(Uploader)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Search)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Icon)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Field)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(Notify)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Toast)

Toast.setDefaultOptions({ duration: 2000 })
