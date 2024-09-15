const app = require('./src/app')
const { port } = require('./src/core/index.config')
const PORT = port || 3000

const server = app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

process.on("SIGINT", () => {
    console.log("Server stopping")
    server.close(() => {
        console.log("Server stopped")
        process.exit(0)
    })
})