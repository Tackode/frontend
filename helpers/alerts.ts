export function showError(bvToast: any, title: string, error: Error) {
  bvToast.toast(error.message, {
    title,
    autoHideDelay: 10000,
    variant: 'danger',
    toaster: 'b-toaster-top-center',
    appendToast: true,
  })
}

export function showSuccess(bvToast: any, title: string, message: string) {
  bvToast.toast(message, {
    title,
    autoHideDelay: 10000,
    variant: 'success',
    toaster: 'b-toaster-top-center',
    appendToast: true,
  })
}
