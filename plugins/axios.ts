export default function ({ $axios, $env }: any) {
  $axios.defaults.baseURL = $env.API_URL
}
