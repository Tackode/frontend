export default function ({ $axios, $config }: any) {
  $axios.defaults.baseURL = $config.apiUrl
}
