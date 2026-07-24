// ============================================
// ZAKA PRIVATE SERVER - VERCEL
// ============================================

// Secret key (change this weekly)
const SECRET_KEY = process.env.SECRET_KEY || 'zakacheats_2026';

// Your cheat script
const cheatScript = `
-- ============================================
-- ZAKA PRIVATE SERVER
-- ============================================
print("🔥 ZAKA Private Server Loaded!")

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

print("✅ ZAKA Aimlock Loaded!")

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

print("✅ ZAKA Backjump Loaded!")

-- ============================================
-- SPEED HACK
-- ============================================
local speedhack = {
    enabled = true,
    speedMultiplier = 1.8,
}

function speedhack.onTick()
    if not speedhack.enabled then return end
    local player = GetLocalPlayer()
    if player then
        local currentSpeed = player.walkSpeed
        local newSpeed = currentSpeed * speedhack.speedMultiplier
        SetWalkSpeed(newSpeed)
    end
end

print("✅ ZAKA Speed Hack Loaded!")

-- ============================================
-- FAST RELOAD
-- ============================================
local fastreload = {
    enabled = true,
    reloadTime = 0.01,
}

function fastreload.onTick()
    if not fastreload.enabled then return end
    local weapon = GetCurrentWeapon()
    if weapon then
        SetReloadTime(weapon, fastreload.reloadTime)
    end
end

print("✅ ZAKA Fast Reload Loaded!")

-- ============================================
-- FAST FIRING
-- ============================================
local fastfiring = {
    enabled = true,
    fireRate = 0.001,
}

function fastfiring.onTick()
    if not fastfiring.enabled then return end
    local weapon = GetCurrentWeapon()
    if weapon then
        SetFireRate(weapon, fastfiring.fireRate)
    end
end

print("✅ ZAKA Fast Firing Loaded!")

-- ============================================
-- INFINITE AMMO
-- ============================================
local infiniteammo = {
    enabled = true,
    ammoCount = 9999,
}

function infiniteammo.onTick()
    if not infiniteammo.enabled then return end
    local weapon = GetCurrentWeapon()
    if weapon then
        SetAmmo(weapon, infiniteammo.ammoCount)
    end
end

print("✅ ZAKA Infinite Ammo Loaded!")

-- ============================================
-- REGISTER ALL HACKS
-- ============================================
RegisterTickFunction(aimlock.onTick)
RegisterTickFunction(backjump.onTick)
RegisterTickFunction(speedhack.onTick)
RegisterTickFunction(fastreload.onTick)
RegisterTickFunction(fastfiring.onTick)
RegisterTickFunction(infiniteammo.onTick)

print("========================================")
print("🔥 ZAKA Full Package Ready!")
print("✅ Aimlock | Backjump | Speed | Reload | Fire | Ammo")
print("========================================")
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
            server: 'ZAKA Private Server',
            version: '2.3.1',
            author: 'Zaka',
            features: [
                'Aimlock',
                'Backjump',
                'Speed Hack',
                'Fast Reload',
                'Fast Firing',
                'Infinite Ammo'
            ],
            copyright: '© ZAKA 2026'
        });
        return;
    }

    // ============================================
    // BROWSER REQUEST - Show branded page
    // ============================================
    if (!isFreeFire) {
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>ZAKA - Private Server</title>
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
                    .features {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin: 30px 0;
                    }
                    .feature {
                        background: rgba(233, 69, 96, 0.1);
                        padding: 10px;
                        border-radius: 8px;
                        border: 1px solid rgba(233, 69, 96, 0.2);
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
                    .copyright {
                        margin-top: 30px;
                        color: #444;
                        font-size: 0.9em;
                    }
                    .status {
                        color: #4ade80;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="badge">🔒 PRIVATE SERVER</div>
                    <h1>🔥 ZAKA</h1>
                    <p class="subtitle">Free Fire MAX - Advanced Config Loader</p>
                    <p style="color: #666; font-size: 0.9em;">Status: <span class="status">● Online</span></p>
                    <div class="features">
                        <div class="feature">🎯 Aimlock</div>
                        <div class="feature">🦘 Backjump</div>
                        <div class="feature">💨 Speed Hack</div>
                        <div class="feature">🔄 Fast Reload</div>
                        <div class="feature">🔥 Fast Firing</div>
                        <div class="feature">♾️ Infinite Ammo</div>
                    </div>
                    <div class="copyright">${req.query.copyright || '© ZAKA 2026'}</div>
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
