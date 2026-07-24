-- ============================================
-- HOLOXZTER PRIVATE SERVER v2.0
-- Free Fire MAX - Aimlock + Backjump
-- ============================================
-- YouTube: https://youtube.com/@holoxzterreal
-- WhatsApp: https://whatsapp.com/channel/0029Vb88dhE0QeapekxfUC1N
-- ============================================

print("🔥 Zaka Private Server Loaded Successfully!")
print("📺 YouTube: https://youtube.com/@holoxzterreal")
print("📱 WhatsApp: https://whatsapp.com/channel/0029Vb88dhE0QeapekxfUC1N")
print("⚡ Waiting for match to start...")

-- ============================================
-- CONFIGURATION
-- ============================================
local config = {
    -- Aimlock Settings
    aimlock = {
        enabled = true,
        fov = 120,              -- Field of view (degrees)
        smoothness = 0.85,      -- 0.1 = instant, 1.0 = very smooth
        targetBone = "head",    -- head, chest, torso
        maxDistance = 150,      -- meters
        reactionMin = 120,      -- Minimum reaction delay (ms)
        reactionMax = 280,      -- Maximum reaction delay (ms)
        missRate = 0.07,        -- 7% chance to miss (human-like)
        aimKey = "fire",        -- Key to activate aimlock (fire, aim, both)
    },
    
    -- Backjump Settings
    backjump = {
        enabled = true,
        jumpHeight = 1.5,       -- Multiplier (1.0 = normal)
        airControl = 0.8,       -- 0 = no control, 1 = full control
        autoBhop = true,        -- Auto bunny hop
        jumpKey = "space",      -- Jump key
    },
    
    -- Visual Settings
    visual = {
        showCrosshair = false,  -- Show custom crosshair
        crosshairColor = 0xFF0000, -- Red
        showESP = false,        -- Show enemy ESP (risky)
    }
}

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Random number between min and max
function randomRange(min, max)
    return math.random() * (max - min) + min
end

-- Check if key is pressed (works for both keyboard and touch)
function isKeyPressed(key)
    if key == "space" then
        return IsKeyDown("space") or IsButtonPressed("jump")
    elseif key == "fire" then
        return IsShooting()
    elseif key == "aim" then
        return IsAiming()
    elseif key == "both" then
        return IsShooting() or IsAiming()
    end
    return false
end

-- ============================================
-- AIMLOCK SYSTEM
-- ============================================

local aimlock = {
    enabled = true,
    target = nil,
    lastTarget = nil,
    shotCounter = 0,
}

-- Get all living enemies
function aimlock.getEnemies()
    local enemies = {}
    local players = GetPlayers()
    local localPlayer = GetLocalPlayer()
    
    if not localPlayer then return enemies end
    
    for i, player in ipairs(players) do
        if player and player.alive and player.team ~= localPlayer.team then
            table.insert(enemies, player)
        end
    end
    
    return enemies
end

-- Get angle to target
function aimlock.getAngleToTarget(target)
    local localPlayer = GetLocalPlayer()
    if not localPlayer or not target then return 0, 0 end
    
    local localPos = localPlayer.position
    local targetPos = target.position
    
    local dx = targetPos.x - localPos.x
    local dy = targetPos.y - localPos.y
    local dz = targetPos.z - localPos.z
    
    local yaw = math.atan2(dy, dx)
    local pitch = math.atan2(dz, math.sqrt(dx*dx + dy*dy))
    
    return yaw, pitch
end

-- Get distance to target
function aimlock.getDistance(target)
    local localPlayer = GetLocalPlayer()
    if not localPlayer or not target then return 9999 end
    
    local dx = target.position.x - localPlayer.position.x
    local dy = target.position.y - localPlayer.position.y
    local dz = target.position.z - localPlayer.position.z
    
    return math.sqrt(dx*dx + dy*dy + dz*dz)
end

-- Find closest enemy within FOV and distance
function aimlock.findBestTarget()
    local enemies = aimlock.getEnemies()
    local bestTarget = nil
    local bestScore = 9999
    
    for _, enemy in ipairs(enemies) do
        local distance = aimlock.getDistance(enemy)
        
        -- Check distance limit
        if distance > config.aimlock.maxDistance then
            goto continue
        end
        
        -- Check if visible (not behind wall)
        if not IsVisible(enemy) then
            goto continue
        end
        
        -- Calculate angle
        local yaw, pitch = aimlock.getAngleToTarget(enemy)
        local angle = math.sqrt(yaw*yaw + pitch*pitch)
        
        -- Check FOV
        if angle > config.aimlock.fov then
            goto continue
        end
        
        -- Score: prioritize close + centered
        local score = angle * 10 + distance * 0.1
        if score < bestScore then
            bestScore = score
            bestTarget = enemy
        end
        
        ::continue::
    end
    
    return bestTarget
end

-- Smoothly move crosshair to target
function aimlock.smoothAim(target)
    if not target then return end
    
    local currentYaw, currentPitch = GetCameraRotation()
    local targetYaw, targetPitch = aimlock.getAngleToTarget(target)
    
    -- Calculate differences
    local diffYaw = targetYaw - currentYaw
    local diffPitch = targetPitch - currentPitch
    
    -- Apply smoothing
    local smoothYaw = currentYaw + (diffYaw * config.aimlock.smoothness)
    local smoothPitch = currentPitch + (diffPitch * config.aimlock.smoothness)
    
    -- Add human-like jitter (tiny random movements)
    local jitterYaw = (math.random() - 0.5) * 0.02
    local jitterPitch = (math.random() - 0.5) * 0.02
    
    SetCameraRotation(smoothYaw + jitterYaw, smoothPitch + jitterPitch)
end

-- Determine if we should miss this shot (human-like)
function aimlock.shouldMiss()
    aimlock.shotCounter = aimlock.shotCounter + 1
    
    -- Don't miss first 3 shots (like a human warming up)
    if aimlock.shotCounter < 3 then
        return false
    end
    
    -- Random miss chance
    return math.random() < config.aimlock.missRate
end

-- Main aimlock tick
function aimlock.onTick()
    if not config.aimlock.enabled then return end
    if not IsInGame() then return end
    
    -- Check if aiming or shooting
    if not isKeyPressed(config.aimlock.aimKey) then
        aimlock.target = nil
        return
    end
    
    -- Find best target
    local target = aimlock.findBestTarget()
    if not target then
        aimlock.target = nil
        return
    end
    
    -- Human reaction delay
    local delay = randomRange(config.aimlock.reactionMin, config.aimlock.reactionMax)
    Sleep(delay)
    
    -- Check if we should miss
    if aimlock.shouldMiss() then
        -- Slightly offset aim
        local yaw, pitch = GetCameraRotation()
        SetCameraRotation(
            yaw + (math.random() - 0.5) * 0.5,
            pitch + (math.random() - 0.5) * 0.5
        )
        aimlock.target = nil
        return
    end
    
    -- Lock onto target
    aimlock.smoothAim(target)
    aimlock.target = target
    
    -- Reset shot counter when not shooting
    if not IsShooting() then
        aimlock.shotCounter = 0
    end
end

print("✅ Aimlock System Initialized")

-- ============================================
-- BACKJUMP SYSTEM
-- ============================================

local backjump = {
    enabled = true,
    isJumping = false,
    jumpTimer = 0,
}

-- Override jump physics (restore old backjump)
function backjump.overrideJump()
    if not config.backjump.enabled then return end
    if not IsInGame() then return end
    
    local player = GetLocalPlayer()
    if not player then return end
    
    local isGrounded = player.isGrounded
    local jumpPressed = isKeyPressed(config.backjump.jumpKey)
    
    -- Main jump override
    if isGrounded and jumpPressed then
        local velocity = player.velocity
        local moveDir = GetMoveDirection()
        
        -- Calculate backjump velocity
        local jumpVelocity = {
            x = velocity.x * 0.5 - (moveDir.x or 0) * 0.3,
            y = config.backjump.jumpHeight * 5.0,
            z = velocity.z * 0.5 - (moveDir.z or 0) * 0.3
        }
        
        SetVelocity(jumpVelocity)
        backjump.isJumping = true
        backjump.jumpTimer = 0.5
    end
    
    -- Auto bunny hop
    if config.backjump.autoBhop and isGrounded and isKeyPressed(config.backjump.jumpKey) then
        PerformJump()
    end
    
    -- Jump timer
    if backjump.jumpTimer > 0 then
        backjump.jumpTimer = backjump.jumpTimer - 0.016
        if backjump.jumpTimer <= 0 then
            backjump.isJumping = false
        end
    end
end

-- Enhanced air control (mid-air direction changes)
function backjump.airControl()
    if not config.backjump.enabled then return end
    if not IsInGame() then return end
    
    local player = GetLocalPlayer()
    if not player then return end
    
    -- Only apply air control when in the air
    if not player.isGrounded then
        local moveDir = GetMoveDirection()
        local currentVelocity = player.velocity
        
        -- Apply air control with smoothing
        local newVelocity = {
            x = currentVelocity.x + (moveDir.x - currentVelocity.x) * config.backjump.airControl * 0.1,
            y = currentVelocity.y,
            z = currentVelocity.z + (moveDir.z - currentVelocity.z) * config.backjump.airControl * 0.1
        }
        
        SetVelocity(newVelocity)
    end
end

-- Main backjump tick
function backjump.onTick()
    if not config.backjump.enabled then return end
    if not IsInGame() then return end
    
    backjump.overrideJump()
    backjump.airControl()
end

print("✅ Backjump System Initialized")

-- ============================================
-- VISUAL SYSTEM (ESP - Optional)
-- ============================================

local visual = {
    enabled = false,
}

function visual.onTick()
    if not config.visual.showESP then return end
    if not IsInGame() then return end
    
    local enemies = aimlock.getEnemies()
    for _, enemy in ipairs(enemies) do
        if IsVisible(enemy) then
            -- Draw box around enemy (if game supports it)
            -- Note: Most Free Fire versions don't allow drawing
            -- This is placeholder for compatibility
        end
    end
end

-- ============================================
-- ANTI-AFK / IDLE DETECTION BYPASS
-- ============================================

local antiAfk = {
    enabled = true,
    timer = 0,
}

function antiAfk.onTick()
    if not antiAfk.enabled then return end
    if not IsInGame() then return end
    
    antiAfk.timer = antiAfk.timer + 0.016
    
    -- Move slightly every 30 seconds to avoid idle detection
    if antiAfk.timer > 30 then
        antiAfk.timer = 0
        -- Simulate slight mouse movement
        local yaw, pitch = GetCameraRotation()
        SetCameraRotation(yaw + 0.01, pitch)
    end
end

print("✅ Anti-AFK System Initialized")

-- ============================================
-- PERFORMANCE OPTIMIZATION
-- ============================================

-- Only run when in match
local function mainLoop()
    if not IsInGame() then
        -- Wait 1 second before checking again
        Sleep(1000)
        return
    end
    
    -- Run all systems
    aimlock.onTick()
    backjump.onTick()
    visual.onTick()
    antiAfk.onTick()
end

-- ============================================
-- REGISTER MAIN LOOP
-- ============================================

-- Register the tick function
RegisterTickFunction(mainLoop)

-- Also register individual functions for better performance
-- (different games handle this differently)
if RegisterTickFunction then
    -- Already registered above
else
    -- Alternative registration method
    print("⚠️ Using alternative registration method")
end

-- ============================================
-- STATUS REPORT
-- ============================================

print("")
print("========================================")
print("  🔥 ZAKA PRIVATE SERVER 🔥")
print("========================================")
print("  ✅ Aimlock: " .. (config.aimlock.enabled and "ENABLED" or "DISABLED"))
print("     - FOV: " .. config.aimlock.fov .. "°")
print("     - Smoothness: " .. config.aimlock.smoothness)
print("     - Max Distance: " .. config.aimlock.maxDistance .. "m")
print("  ✅ Backjump: " .. (config.backjump.enabled and "ENABLED" or "DISABLED"))
print("     - Jump Height: " .. config.backjump.jumpHeight .. "x")
print("     - Air Control: " .. config.backjump.airControl)
print("  ✅ Anti-AFK: " .. (antiAfk.enabled and "ENABLED" or "DISABLED"))
print("========================================")
print("  📺 YouTube: @holoxzterreal")
print("  📱 WhatsApp: HOLOXZTER Channel")
print("========================================")
print("  ⚡ Ready for battle!")
print("========================================")

-- ============================================
-- HOTKEY TOGGLE (Optional)
-- ============================================

-- Toggle aimlock with key (if supported)
-- Note: Free Fire may not support keyboard hooks
-- This is for reference if the game supports it

-- function toggleAimlock()
--     config.aimlock.enabled = not config.aimlock.enabled
--     print("Aimlock: " .. (config.aimlock.enabled and "ON" or "OFF"))
-- end
-- RegisterKey("F1", toggleAimlock)

-- Toggle backjump with key
-- function toggleBackjump()
--     config.backjump.enabled = not config.backjump.enabled
--     print("Backjump: " .. (config.backjump.enabled and "ON" or "OFF"))
-- end
-- RegisterKey("F2", toggleBackjump)

print("💡 Press F1 to toggle Aimlock (if supported)")
print("💡 Press F2 to toggle Backjump (if supported)")

-- ============================================
-- END OF SCRIPT
-- ============================================
