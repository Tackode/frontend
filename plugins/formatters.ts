import { format } from 'date-fns'
import Vue from 'vue'

Vue.filter('formatDate', function (value: string) {
  if (!value) {
    return ''
  }

  try {
    return format(new Date(value.substring(0, 10)), 'dd/MM/yyyy')
  } catch {
    return value
  }
})

Vue.filter('formatDateTime', function (value: string) {
  if (!value) {
    return ''
  }

  try {
    return format(new Date(value), 'dd/MM/yyyy HH:mm')
  } catch {
    return value
  }
})
