
let nowWeek = ''
const week = new Date().getDay()
if (week === 1) {
  nowWeek = '星期一'
} else if (week === 2) {
  nowWeek = '星期二'
} else if (week === 3) {
  nowWeek = '星期三'
} else if (week === 4) {
  nowWeek = '星期四'
} else if (week === 5) {
  nowWeek = '星期五'
} else if (week === 6) {
  nowWeek = '星期六'
} else {
  nowWeek = '星期日'
}

function getDay (day) {
  var today = new Date()
  var milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(milliseconds) // 注意，这行是关键代码

  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth (month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
// console.log("1000年以后：", getDay(1000 * 365))
const nowDate = getDay(0)
const latMonth = getDay(-30)
export { nowWeek, nowDate, latMonth }
