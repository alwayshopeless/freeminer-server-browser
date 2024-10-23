  const { createApp, ref, computed } = Vue

        createApp({
            setup() {
                const servers = ref([])
                const totalServers = ref(0)
                const totalClients = ref(0)
                const search = ref('')
                const theme = ref(localStorage.getItem('theme') || 'dark-theme')

                const toggleTheme = () => {
                    theme.value = theme.value === 'light-theme' ? 'dark-theme' : 'light-theme'
                    localStorage.setItem('theme', theme.value)
                    document.body.className = theme.value
                }

                const filteredServers = computed(() => {
                    return servers.value.filter(server => 
                        server.name.toLowerCase().includes(search.value.toLowerCase()) ||
                        server.description.toLowerCase().includes(search.value.toLowerCase())
                    )
                })

                const getPlayLink = (server) => {
                    return `https://play.freeminer.org/?go=1&address=${server.address}&port=${server.port}&name=`
                }

                const fetchData = async () => {
                    try {
                        const response = await axios.get('https://servers.freeminer.org/list')
                        servers.value = response.data.list
                        totalServers.value = response.data.total.servers
                        totalClients.value = response.data.total.clients
                    } catch (error) {
                        console.error('Error fetching server data:', error)
                    }
                }

                // Initial theme setup
                document.body.className = theme.value

                // Initial fetch
                fetchData()

                // Refresh every 30 seconds
                setInterval(fetchData, 30000)

                return {
                    servers,
                    totalServers,
                    totalClients,
                    search,
                    filteredServers,
                    getPlayLink,
                    theme,
                    toggleTheme
                }
            }
        }).mount('#app')