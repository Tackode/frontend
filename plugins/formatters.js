import Vue from 'vue'
import { format } from 'date-fns'

Vue.filter('formatDate', function(value) {
  if (!value) {
    return ''
  }

  try {
    return format(new Date(value.substring(0, 10)), 'dd/MM/yyyy')
  } catch {
    return value
  }
})

Vue.filter('formatDateTime', function(value) {
  if (!value) {
    return ''
  }

  try {
    return format(new Date(value), 'dd/MM/yyyy HH:mm')
  } catch {
    return value
  }
})
