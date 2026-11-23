"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const Mongoose_1 = require("./Components/ConnectToDatabase/Mongoose");
const AuthRoutes_1 = require("./Components/UserRoutes/AuthRoutes");
const FetchGames_1 = require("./Components/FetchGames/FetchGames");
const UpdateUser_1 = require("./Components/UserRoutes/UpdateUser");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const cookieParser = require("cookie-parser");
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "https://gamerslobby.vercel.app",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));
app.use(cookieParser());
(0, Mongoose_1.connectToDatabase)();
(0, AuthRoutes_1.setupRoutes)(app);
(0, UpdateUser_1.updateUser)(app);
(0, FetchGames_1.fetchGames)(app);
(0, FetchGames_1.favoriteGame)(app);
app.get('/health', (req, res) => {
    res.json({ ok: true });
});
app.get('/', (req, res) => {
    res.send('Backend server listening');
});
/* A free Render instance spins down after 15 minutes without inbound traffic and the
   wake costs the next visitor about a minute. Asking for our own /health every 4 minutes
   keeps inbound traffic non-zero, so the service never sleeps.
   shortcut: Render documents the 15-minute rule, not self-ping. If Render ever stops
   counting a service's own requests as inbound, move this to an external monitor. */
const publicUrl = process.env.RENDER_EXTERNAL_URL;
if (process.env.RENDER === 'true' && publicUrl) {
    setInterval(() => {
        axios_1.default.get(`${publicUrl}/health`, { timeout: 10000 }).catch(() => { });
    }, 4 * 60 * 1000);
}
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
