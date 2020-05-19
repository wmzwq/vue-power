import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../components/login/Login.vue')
const Home = () => import('../components/home/Home.vue')
const My = () => import('../components/home/My.vue')
const Main = () => import('../components/home/Main.vue')
const Message = () => import('../components/home/Message.vue')
const Management = () => import('../components/fault/Management.vue')
const List = () => import('../components/fault/List.vue')
const Online = () => import('../components/line/Online.vue')
const Equipment = () => import('../components/line/Equipment.vue')
const Factor = () => import('../components/power/Factor.vue')
const Details = () => import('../components/power/Details.vue')
const EnergyCharge = () => import('../components/electric/EnergyCharge.vue')
const BatteryDetails = () => import('../components/electric/BatteryDetails.vue')
const ElectricityDay = () => import('../components/electric/ElectricityDay.vue')
const ElectricityMonth = () => import('../components/electric/ElectricityMonth.vue')
const Structure = () => import('../components/electric/Structure.vue')
const PowerLoad = () => import('../components/load/PowerLoad.vue')
const LoadDetails = () => import('../components/load/LoadDetails.vue')
const LoadCounts = () => import('../components/load/LoadCounts.vue')
const SCADA = () => import('../components/scada/Scada.vue')
const GIS = () => import('../components/location/GIS.vue')
const Monitoring = () => import('../components/video/Monitoring.vue')
const Tasks = () => import('../components/inspection/Tasks.vue')
const CheckingList = () => import('../components/inspection/CheckingList.vue')
const Performed = () => import('../components/inspection/Performed.vue')
const CheckingDetails = () => import('../components/inspection/CheckingDetails.vue')
const CheckingInformation = () => import('../components/inspection/CheckingInformation.vue')
const CheckingHistory = () => import('../components/inspection/CheckingHistory.vue')
const DetailsFinish = () => import('../components/inspection/DetailsFinish.vue')
const RepairTask = () => import('../components/repair/RepairTask.vue')
const RepairList = () => import('../components/repair/RepairList.vue')
const RepairsPerformed = () => import('../components/repair/RepairsPerformed.vue')
const RepairHistory = () => import('../components/repair/RepairHistory.vue')
const More = () => import('../components/home/More.vue')
const DefectManagement = () => import('../components/defects/DefectManagement.vue')
const DefectList = () => import('../components/defects/DefectList.vue')
const ParameterInformation = () => import('../components/parameter/ParameterInformation.vue')
const RoomDetails = () => import('../components/parameter/RoomDetails.vue')
const IntoLine = () => import('../components/parameter/IntoLine.vue')
const FaultRepair = () => import('../components/refer/FaultRepair.vue')
const Information = () => import('../components/customer/Information.vue')
const Maintenance = () => import('../components/personnel/Maintenance.vue')
const Scan = () => import('../components/home/Scan.vue')
const InfoDetails = () => import('../components/customer/InfoDetails.vue')
const PeopleDetails = () => import('../components/personnel/PeopleDetails.vue')
const FaultReport = () => import('../components/refer/FaultReport.vue')
const DefectPeformed = () => import('../components/defects/DefectPeformed.vue')
const DefectHistory = () => import('../components/defects/DefectHistory.vue')
const MessageDetail = () => import('../components/home/MessageDetail.vue')
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/main',
    children: [
      { path: '/main', component: Main },
      { path: '/my', component: My }
    ]
  },
  { path: '/message', component: Message },
  { path: '/management', component: Management },
  { path: '/list', component: List },
  { path: '/online', component: Online },
  { path: '/equipment', component: Equipment },
  { path: '/factor', component: Factor },
  { path: '/details', component: Details },
  { path: '/energyCharge', component: EnergyCharge },
  { path: '/batteryDetails', component: BatteryDetails },
  { path: '/electricityDay', component: ElectricityDay },
  { path: '/electricityMonth', component: ElectricityMonth },
  { path: '/structure', component: Structure },
  { path: '/powerLoad', component: PowerLoad },
  { path: '/loadDetails', component: LoadDetails },
  { path: '/loadCounts', component: LoadCounts },
  { path: '/scada', component: SCADA },
  { path: '/gis', component: GIS },
  { path: '/monitoring', component: Monitoring },
  { path: '/tasks', component: Tasks },
  { path: '/checkingList', component: CheckingList },
  { path: '/performed', component: Performed },
  { path: '/checkingDetails', component: CheckingDetails },
  { path: '/checkingInformation', component: CheckingInformation },
  { path: '/checkingHistory', component: CheckingHistory },
  { path: '/detailsFinish', component: DetailsFinish },
  { path: '/repairTask', component: RepairTask },
  { path: '/repairList', component: RepairList },
  { path: '/repairsPerformed', component: RepairsPerformed },
  { path: '/repairHistory', component: RepairHistory },
  { path: '/more', component: More },
  { path: '/defectManagement', component: DefectManagement },
  { path: '/defectList', component: DefectList },
  { path: '/parameterInformation', component: ParameterInformation },
  { path: '/roomDetails', component: RoomDetails },
  { path: '/intoLine', component: IntoLine },
  { path: '/faultRepair', component: FaultRepair },
  { path: '/information', component: Information },
  { path: '/maintenance', component: Maintenance },
  { path: '/scan', component: Scan },
  { path: '/infoDetails', component: InfoDetails },
  { path: '/peopleDetails', component: PeopleDetails },
  { path: '/defectPeformed', component: DefectPeformed },
  { path: '/defectHistory', component: DefectHistory },
  { path: '/faultReport', component: FaultReport },
  { path: '/messageDetail', component: MessageDetail }
]

Vue.use(VueRouter)
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数 表示放行
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') {
    if (user) return next('/home')
    next()
  } else {
    if (user === null || user === '') {
      next('/login')
    } else {
      next()
    }
  }
})
export default router
