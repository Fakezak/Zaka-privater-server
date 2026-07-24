// ============================================
// HOLOXZTER PRIVATE SERVER - VERCEL
// ============================================

// Secret key (change this weekly)
const SECRET_KEY = process.env.SECRET_KEY || 'zakacheats_2026';

// Your cheat script
const cheatScript = `
-- ============================================
-- HOLOXZTER PRIVATE SERVER
-- ============================================
print("🔥 ZAKA Private Server Loaded!")
print("📺 YouTube: https://youtube.com/@holoxzterreal")
print("📱 WhatsApp: https://whatsapp.com/channel/0029Vb88dhE0QeapekxfUC1N")

-- ============================================
-- AIMLOCK SCRIPT
-- ============================================
local aimlock = {
    enabled = true,
    fov = 120,
    smoothness = 0.85,
    targetBone = "head",
    maxDistance = 150,
    reactionMin = 120,
    reactionMax = 280,
}

function aimlock.getTargets()
    local enemies = {}
    local players = GetPlayers()
    for i, p in ipairs(players) do
        if p.team ~= GetLocalPlayer().team and p.alive then
            table.insert(enemies, p)
        end
    end
    return enemies
end

function aimlock.getAngleToTarget(target)
    local localPos = GetLocalPlayer().position
    local targetPos = target.position
    local dx = targetPos.x - localPos.x
    local dy = targetPos.y - localPos.y
    local dz = targetPos.z - localPos.z
    local yaw = math.atan2(dy, dx)
    local pitch = math.atan2(dz, math.sqrt(dx*dx + dy*dy))
    return yaw, pitch
end

function aimlock.findClosestEnemy()
    local enemies = aimlock.getTargets()
    local bestTarget = nil
    local bestAngle = aimlock.fov
    for _, enemy in ipairs(enemies) do
        local yaw, pitch = aimlock.getAngleToTarget(enemy)
        local angle = math.sqrt(yaw*yaw + pitch*pitch)
        if angle < bestAngle then
            bestAngle = angle
            bestTarget = enemy
        end
    end
    return bestTarget
end

function aimlock.smoothAim(target)
    if not target then return end
    local currentYaw, currentPitch = GetLocalPlayer().cameraRotation
    local targetYaw, targetPitch = aimlock.getAngleToTarget(target)
    local diffYaw = targetYaw - currentYaw
    local diffPitch = targetPitch - currentPitch
    local smoothYaw = currentYaw + (diffYaw * aimlock.smoothness)
    local smoothPitch = currentPitch + (diffPitch * aimlock.smoothness)
    local jitter = (math.random() - 0.5) * 0.02
    SetCameraRotation(smoothYaw + jitter, smoothPitch + jitter)
end

function aimlock.shouldMiss()
    return math.random() < 0.07
end

function aimlock.onTick()
    if not aimlock.enabled then return end
    if not IsShooting() and not IsAiming() then return end
    local target = aimlock.findClosestEnemy()
    if not target then return end
    local delay = math.random(aimlock.reactionMin, aimlock.reactionMax)
    Sleep(delay)
    if aimlock.shouldMiss() then
        SetCameraRotation(
            GetCameraRotation() + (math.random() - 0.5) * 0.5,
            GetCameraRotation() + (math.random() - 0.5) * 0.5
        )
        return
    end
    aimlock.smoothAim(target)
end

print("✅ HOLOXZTER Aimlock Loaded!")

-- ============================================
-- BACKJUMP SCRIPT
-- ============================================
local backjump = {
    enabled = true,
    jumpHeight = 1.5,
    airControl = 0.8,
    autoBhop = true,
}

function backjump.overrideJump()
    if not backjump.enabled then return end
    local player = GetLocalPlayer()
    if player.isGrounded and IsKeyDown("space") then
        local velocity = player.velocity
        local moveDir = GetMoveDirection()
        local jumpVel = {
            x = velocity.x * 0.5 - moveDir.x * 0.3,
            y = backjump.jumpHeight * 5.0,
            z = velocity.z * 0.5 - moveDir.z * 0.3
        }
        SetVelocity(jumpVel)
    end
    if backjump.autoBhop and player.isGrounded and IsKeyDown("space") then
        PerformJump()
    end
end

function backjump.onTick()
    backjump.overrideJump()
end

print("✅ HOLOXZTER Backjump Loaded!")

-- ============================================
-- REGISTER BOTH
-- ============================================
RegisterTickFunction(aimlock.onTick)
RegisterTickFunction(backjump.onTick)

print("✅ HOLOXZTER Full Package Ready!")
`;

// ============================================
// HANDLER - MAIN ENTRY POINT
// ============================================
module.exports = (req, res) => {
    // Log request
    console.log('=== REQUEST RECEIVED ===');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('x-requested-with:', req.headers['x-requested-with']);
    console.log('Query:', req.query);

    // ============================================
    // SECRET HANDSHAKE
    // ============================================
    const userAgent = req.headers['user-agent'] || '';
    const requestedWith = req.headers['x-requested-with'] || '';
    
    // Check if it's Free Fire
    const isFreeFire = userAgent.includes('Dalvik') || 
                       userAgent.includes('Android') ||
                       requestedWith.includes('freefire') ||
                       requestedWith.includes('dts') ||
                       req.query.key === SECRET_KEY;

    // ============================================
    // STATUS ENDPOINT (for testing)
    // ============================================
    if (req.url === '/status' || req.query.status === 'true') {
        res.status(200).json({
            status: 'online',
            server: 'HOLOXZTER Private Server',
            version: '2.0',
            copyright: '© HOLOXZTER',
            links: {
                youtube: 'https://youtube.com/@holoxzterreal',
                whatsapp: 'https://whatsapp.com/channel/0029Vb88dhE0QeapekxfUC1N'
            }
        });
        return;
    }

    // ============================================
    // BROWSEER REQUEST - Show branded page
    // ============================================
    if (!isFreeFire) {
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>HOLOXZTER - Private Server</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
                        color: white;
                        font-family: 'Segoe UI', Arial, sans-serif;
                        text-align: center;
                        padding: 50px 20px;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        max-width: 600px;
                        background: rgba(255,255,255,0.05);
                        border-radius: 20px;
                        padding: 40px;
                        border: 1px solid rgba(255,255,255,0.1);
                    }
                    h1 {
                        font-size: 3em;
                        background: linear-gradient(45deg, #e94560, #ff6b81);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .subtitle {
                        color: #888;
                        margin: 10px 0 30px;
                    }
                    .links {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        margin: 30px 0;
                    }
                    .links a {
                        color: white;
                        background: rgba(233, 69, 96, 0.2);
                        padding: 15px;
                        border-radius: 10px;
                        text-decoration: none;
                        border: 1px solid rgba(233, 69, 96, 0.3);
                        transition: all 0.3s;
                    }
                    .links a:hover {
                        background: rgba(233, 69, 96, 0.4);
                        transform: scale(1.02);
                    }
                    .copyright {
                        margin-top: 30px;
                        color: #444;
                        font-size: 0.9em;
                    }
                    .badge {
                        display: inline-block;
                        background: #e94560;
                        color: white;
                        padding: 5px 15px;
                        border-radius: 20px;
                        font-size: 0.8em;
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="badge">🔒 PRIVATE SERVER</div>
                    <h1>🔥 HOLOXZTER</h1>
                    <p class="subtitle">Free Fire MAX - Advanced Config Loader</p>
                    <p style="color: #666; font-size: 0.9em;">Status: <span style="color: #4ade80;">● Online</span></p>
                    <div class="links">
                        <a href="https://youtube.com/@holoxzterreal">▶️ Subscribe on YouTube</a>
                        <a href="https://whatsapp.com/channel/0029Vb88dhE0QeapekxfUC1N">📱 Join WhatsApp Channel</a>
                    </div>
                    <div class="copyright">${req.query.copyright || '© HOLOXZTER 2026'}</div>
                </div>
            </body>
            </html>
        `);
        return;
    }

    // ============================================
    // FREE FIRE REQUEST - Serve the cheat script
    // ============================================
    console.log('✅ Serving cheat script to Free Fire client');
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="config.bin"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).send(cheatScript);
};
