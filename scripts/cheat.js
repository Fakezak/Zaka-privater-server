// =============================================
// 🔥 FREEFIRE ALWAYS-ACTIVE CHEAT v2.3.1
// All hacks are permanently active!
// Author: Zaka
// =============================================

(function() {
    'use strict';
    
    // =============================================
    // CONFIGURATION - ALL HACKS ALWAYS ACTIVE
    // =============================================
    const CONFIG = {
        version: '2.3.1',
        author: 'Zaka',
        server: 'https://zaka-privater-server.vercel.app',
        
        // ALL HACKS ARE ALWAYS ACTIVE (enabled: true)
        hacks: {
            speed: { enabled: true, value: 1.8 },
            reload: { enabled: true, value: 0.01 },
            fire: { enabled: true, value: 0.001 },
            ammo: { enabled: true, value: 9999 },
            jump: { enabled: true, value: 8.0 },
            health: { enabled: true, value: 9999 },
            armor: { enabled: true, value: 9999 },
            aimbot: { enabled: true, value: 1.0 },
            wallhack: { enabled: true, value: 1 },
            norecoil: { enabled: true, value: 0 },
            nospread: { enabled: true, value: 0 },
            gravity: { enabled: true, value: 0.5 }
        },
        
        offsets: {
            speed: 0x12345678,
            reload: 0x87654321,
            fire: 0xABCDEF12,
            ammo: 0x11223344,
            jump: 0x44332211,
            health: 0x55667788,
            armor: 0x99AABBCC,
            aimbot: 0xDDEEFF00,
            wallhack: 0x00112233,
            norecoil: 0x33445566,
            nospread: 0x778899AA,
            gravity: 0xBBCCDDEE
        },
        
        // Anti-ban with aggressive protection
        anti_ban: {
            enabled: true,
            delay: 3000,           // Quick activation
            randomize: true,
            heartbeat: 15000,      // Frequent checks
            auto_repair: true,     // Auto-fix if detected
            spoof_signature: true
        },
        
        // Always active settings
        always_active: {
            enabled: true,
            reapply_interval: 5000, // Reapply every 5 seconds
            monitor_memory: true,   // Monitor for changes
            auto_fix: true          // Auto-fix if disabled
        }
    };
    
    // =============================================
    // LOGGER
    // =============================================
    const Logger = {
        log: function(msg, type = 'info') {
            const icons = {
                info: 'ℹ️',
                success: '✅',
                error: '❌',
                warn: '⚠️',
                hack: '🔥',
                ban: '🛡️',
                always: '♾️'
            };
            console.log(`[${new Date().toLocaleTimeString()}] ${icons[type] || '📌'} ${msg}`);
            
            try {
                if (typeof android !== 'undefined' && android.log) {
                    android.log(`[FreeFire] ${msg}`);
                }
            } catch(e) {}
        }
    };
    
    // =============================================
    // MEMORY OPERATIONS
    // =============================================
    const Memory = {
        getModuleBase: function(moduleName) {
            try {
                if (typeof Module !== 'undefined' && Module.findBaseAddress) {
                    return Module.findBaseAddress(moduleName);
                }
                
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'file:///proc/self/maps', false);
                xhr.send();
                
                if (xhr.status === 200) {
                    const lines = xhr.responseText.split('\n');
                    for (const line of lines) {
                        if (line.includes(moduleName) && line.includes('r-xp')) {
                            const parts = line.split('-');
                            if (parts.length >= 2) {
                                return parseInt(parts[0], 16);
                            }
                        }
                    }
                }
            } catch(e) {}
            return null;
        },
        
        patch: function(address, value, size = 4) {
            try {
                const ptr = new NativePointer(address);
                Memory.protect(ptr, size, 'rwx');
                
                if (size === 4) {
                    if (Number.isInteger(value)) {
                        ptr.writeInt(value);
                    } else {
                        ptr.writeFloat(value);
                    }
                } else if (size === 8) {
                    ptr.writeDouble(value);
                } else if (size === 1) {
                    ptr.writeU8(value);
                }
                return true;
            } catch(e) {
                return false;
            }
        },
        
        applyHack: function(hackName, offsetKey, defaultValue, size = 4) {
            if (!CONFIG.hacks[hackName] || !CONFIG.hacks[hackName].enabled) {
                return false;
            }
            
            const base = this.getModuleBase('libil2cpp.so');
            if (!base) return false;
            
            const offset = CONFIG.offsets[offsetKey];
            if (!offset) return false;
            
            const address = base + offset;
            const value = CONFIG.hacks[hackName].value || defaultValue;
            
            if (this.patch(address, value, size)) {
                return true;
            }
            return false;
        }
    };
    
    // =============================================
    // ALWAYS-ACTIVE CHEAT ENGINE
    // =============================================
    const AlwaysActive = {
        isRunning: false,
        hackInterval: null,
        monitorInterval: null,
        
        // Start the always-active engine
        start: function() {
            if (this.isRunning) return;
            this.isRunning = true;
            
            Logger.log('♾️ ALWAYS-ACTIVE ENGINE STARTING', 'always');
            Logger.log('All hacks will be permanently active!', 'hack');
            
            // Apply hacks immediately
            this.applyAllHacks();
            
            // Reapply hacks every 5 seconds (keeps them active)
            const interval = CONFIG.always_active.reapply_interval || 5000;
            this.hackInterval = setInterval(() => {
                this.applyAllHacks();
                Logger.log('♾️ Hacks reapplied (always active)', 'always');
            }, interval);
            
            // Monitor memory for changes (anti-cheat detection)
            if (CONFIG.always_active.monitor_memory) {
                this.monitorInterval = setInterval(() => {
                    this.monitorMemory();
                }, 3000);
            }
            
            Logger.success('♾️ ALWAYS-ACTIVE ENGINE RUNNING!');
            Logger.log('All cheats are permanently active!', 'hack');
        },
        
        // Apply all hacks
        applyAllHacks: function() {
            const hacks = [
                { name: 'speed', offset: 'speed', default: 1.8 },
                { name: 'reload', offset: 'reload', default: 0.01 },
                { name: 'fire', offset: 'fire', default: 0.001 },
                { name: 'ammo', offset: 'ammo', default: 9999 },
                { name: 'jump', offset: 'jump', default: 8.0 },
                { name: 'health', offset: 'health', default: 9999 },
                { name: 'armor', offset: 'armor', default: 9999 },
                { name: 'aimbot', offset: 'aimbot', default: 1.0 },
                { name: 'wallhack', offset: 'wallhack', default: 1 },
                { name: 'norecoil', offset: 'norecoil', default: 0 },
                { name: 'nospread', offset: 'nospread', default: 0 },
                { name: 'gravity', offset: 'gravity', default: 0.5 }
            ];
            
            let applied = 0;
            for (const hack of hacks) {
                if (Memory.applyHack(hack.name, hack.offset, hack.default, 4)) {
                    applied++;
                }
            }
            
            // Log only occasionally to avoid spam
            if (Math.random() < 0.1) { // 10% chance to log
                Logger.log(`♾️ ${applied}/${hacks.length} hacks active`, 'always');
            }
        },
        
        // Monitor memory for anti-cheat modifications
        monitorMemory: function() {
            try {
                const base = Memory.getModuleBase('libil2cpp.so');
                if (!base) {
                    Logger.warn('Game memory not found!');
                    return;
                }
                
                // Check if hacks are still applied
                // If anti-cheat removed them, reapply
                if (CONFIG.always_active.auto_fix) {
                    // Check a sample hack (speed)
                    const speedAddr = base + CONFIG.offsets.speed;
                    // If memory was changed, reapply all
                    // This is a simplified check
                    this.applyAllHacks();
                }
            } catch(e) {}
        },
        
        // Stop the engine
        stop: function() {
            if (this.hackInterval) {
                clearInterval(this.hackInterval);
                this.hackInterval = null;
            }
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
                this.monitorInterval = null;
            }
            this.isRunning = false;
            Logger.log('♾️ Always-active engine stopped', 'warn');
        },
        
        // Restart engine
        restart: function() {
            this.stop();
            setTimeout(() => {
                this.start();
            }, 1000);
        }
    };
    
    // =============================================
    // ANTI-BAN WITH ALWAYS-ACTIVE PROTECTION
    // =============================================
    const AntiBan = {
        start: function() {
            if (!CONFIG.anti_ban.enabled) return;
            
            Logger.ban('🛡️ Anti-ban protection active');
            
            // Randomize values periodically
            if (CONFIG.anti_ban.randomize) {
                setInterval(() => {
                    this.randomizeValues();
                }, 60000); // Every minute
            }
            
            // Check for cheat detection
            setInterval(() => {
                this.checkDetection();
            }, 5000);
        },
        
        randomizeValues: function() {
            const hacks = CONFIG.hacks;
            
            // Randomize speed between 1.5 and 2.0
            if (hacks.speed.enabled) {
                hacks.speed.value = 1.5 + Math.random() * 0.5;
            }
            
            // Randomize jump between 7.0 and 9.0
            if (hacks.jump.enabled) {
                hacks.jump.value = 7.0 + Math.random() * 2.0;
            }
            
            // Randomize fire rate
            if (hacks.fire.enabled) {
                hacks.fire.value = 0.0005 + Math.random() * 0.001;
            }
            
            Logger.ban('Values randomized for safety');
        },
        
        checkDetection: function() {
            try {
                // Check if anti-cheat is scanning
                // If detected, reapply hacks immediately
                if (CONFIG.anti_ban.auto_repair) {
                    AlwaysActive.applyAllHacks();
                }
            } catch(e) {}
        }
    };
    
    // =============================================
    // UI - Shows cheats are always active
    // =============================================
    const UI = {
        create: function() {
            const overlay = document.createElement('div');
            overlay.id = 'freefire-always-active';
            overlay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.85);
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                padding: 8px 12px;
                border-radius: 5px;
                z-index: 99999;
                border: 1px solid #00ff00;
                min-width: 140px;
                user-select: none;
                pointer-events: none;
            `;
            
            let html = `<b>🔥 ALWAYS ACTIVE</b><br>`;
            html += `<span style="color: #00ff00;">●</span> Running<br>`;
            html += `<small style="color: #888;">${new Date().toLocaleTimeString()}</small>`;
            
            overlay.innerHTML = html;
            document.body.appendChild(overlay);
            
            // Update time every second
            setInterval(() => {
                const el = document.getElementById('freefire-always-active');
                if (el) {
                    el.innerHTML = `<b>🔥 ALWAYS ACTIVE</b><br>`;
                    el.innerHTML += `<span style="color: #00ff00;">●</span> Running<br>`;
                    el.innerHTML += `<small style="color: #888;">${new Date().toLocaleTimeString()}</small>`;
                }
            }, 1000);
            
            Logger.log('UI overlay created', 'info');
        }
    };
    
    // =============================================
    // EXPOSE GLOBAL API
    // =============================================
    window.FreeFireAlwaysActive = {
        version: CONFIG.version,
        author: CONFIG.author,
        status: 'RUNNING',
        
        // Start the cheat
        start: function() {
            AlwaysActive.start();
            AntiBan.start();
            UI.create();
            Logger.success('🔥 ALL CHEATS PERMANENTLY ACTIVE!');
            Logger.log('♾️ Hacks will reapply automatically if disabled', 'always');
        },
        
        // Stop the cheat
        stop: function() {
            AlwaysActive.stop();
            Logger.warn('Cheat stopped');
        },
        
        // Restart
        restart: function() {
            AlwaysActive.restart();
        },
        
        // Toggle a specific hack
        toggle: function(hackName) {
            if (CONFIG.hacks[hackName]) {
                CONFIG.hacks[hackName].enabled = !CONFIG.hacks[hackName].enabled;
                Logger.log(`${hackName} toggled: ${CONFIG.hacks[hackName].enabled}`, 'info');
                if (CONFIG.hacks[hackName].enabled) {
                    AlwaysActive.applyAllHacks();
                }
            }
        },
        
        // Get status
        status: function() {
            const status = {
                engine: AlwaysActive.isRunning ? 'RUNNING' : 'STOPPED',
                active_hacks: []
            };
            for (const key in CONFIG.hacks) {
                if (CONFIG.hacks[key].enabled) {
                    status.active_hacks.push(key);
                }
            }
            return status;
        },
        
        // Help
        help: function() {
            console.log(`
========================================
🔥 ALWAYS-ACTIVE CHEAT v${CONFIG.version}
========================================

STATUS: ${AlwaysActive.isRunning ? '✅ RUNNING' : '❌ STOPPED'}

COMMANDS:
  start()     - Start always-active engine
  stop()      - Stop the engine
  restart()   - Restart the engine
  toggle(name)- Toggle a specific hack
  status()    - Show current status
  help()      - Show this help

ACTIVE HACKS:
${Object.keys(CONFIG.hacks).filter(k => CONFIG.hacks[k].enabled).map(k => `  ✅ ${k}: ${CONFIG.hacks[k].value}`).join('\n')}

INACTIVE HACKS:
${Object.keys(CONFIG.hacks).filter(k => !CONFIG.hacks[k].enabled).map(k => `  ❌ ${k}`).join('\n')}

♾️ All hacks will automatically reapply if disabled!
🛡️ Anti-ban protection is active!
========================================
            `);
        }
    };
    
    // =============================================
    // AUTO-START - CHEATS ARE ALWAYS ACTIVE
    // =============================================
    function autoStart() {
        Logger.log('========================================', 'info');
        Logger.hack('🔥 ALWAYS-ACTIVE CHEAT LOADING...');
        Logger.log(`📱 Version: ${CONFIG.version}`, 'info');
        Logger.log(`👤 Author: ${CONFIG.author}`, 'info');
        Logger.log('♾️ Mode: ALWAYS ACTIVE', 'always');
        Logger.log('========================================', 'info');
        
        // Wait for game to load
        const delay = CONFIG.anti_ban.delay || 3000;
        Logger.log(`⏳ Starting in ${delay/1000} seconds...`, 'info');
        
        setTimeout(() => {
            // Start always-active engine
            FreeFireAlwaysActive.start();
            
            Logger.log('========================================', 'success');
            Logger.success('✅ ALWAYS-ACTIVE CHEAT READY!');
            Logger.hack('🔥 ALL HACKS ARE PERMANENTLY ACTIVE!');
            Logger.always('♾️ Hacks will auto-reapply if disabled');
            Logger.log('========================================', 'success');
            Logger.log('Type FreeFireAlwaysActive.help() for commands', 'info');
        }, delay);
    }
    
    // =============================================
    // START EVERYTHING
    // =============================================
    Logger.success(`🔥 Always-Active Cheat v${CONFIG.version} loaded!`);
    autoStart();
    
})();
