// =============================================
// FREEFIRE LOADER
// Loads all cheats from localconfig.json
// =============================================

(function() {
    'use strict';
    
    console.log('🔥 FreeFire Loader Starting...');
    console.log('📡 Loading configuration...');
    
    // =============================================
    // LOAD CONFIGURATION
    // =============================================
    function loadConfig() {
        return new Promise((resolve, reject) => {
            try {
                // Try to load localconfig.json
                fetch('/localconfig.json')
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        // Try from server
                        return fetch('https://zaka-privater-server.vercel.app/localconfig.json');
                    })
                    .then(response => response.json())
                    .then(config => {
                        console.log('✅ Configuration loaded!');
                        resolve(config);
                    })
                    .catch(() => {
                        // Use default config
                        console.log('⚠️ Using default configuration');
                        resolve({
                            verAddr: 'https://zaka-privater-server.vercel.app/scripts/cheat.js',
                            luaAddr: 'https://zaka-privater-server.vercel.app/scripts/cheat.lua',
                            configAddr: 'https://zaka-privater-server.vercel.app/scripts/config.dat',
                            injectorAddr: 'https://zaka-privater-server.vercel.app/scripts/injector.js',
                            offsetsAddr: 'https://zaka-privater-server.vercel.app/scripts/offsets.dat'
                        });
                    });
            } catch(e) {
                reject(e);
            }
        });
    }
    
    // =============================================
    // LOAD SCRIPT
    // =============================================
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                console.log(`✅ Loaded: ${url}`);
                resolve();
            };
            script.onerror = () => {
                console.log(`❌ Failed: ${url}`);
                reject();
            };
            document.head.appendChild(script);
        });
    }
    
    // =============================================
    // LOAD ALL CHEATS
    // =============================================
    async function loadAllCheats(config) {
        console.log('========================================');
        console.log('🚀 Loading All Cheats...');
        console.log('========================================');
        
        try {
            // Load config first
            if (config.configAddr) {
                await loadScript(config.configAddr);
            }
            
            // Load offsets
            if (config.offsetsAddr) {
                await loadScript(config.offsetsAddr);
            }
            
            // Load main cheat
            if (config.verAddr) {
                await loadScript(config.verAddr);
            }
            
            // Load injector
            if (config.injectorAddr) {
                await loadScript(config.injectorAddr);
            }
            
            // Load Lua
            if (config.luaAddr) {
                await loadScript(config.luaAddr);
            }
            
            console.log('========================================');
            console.log('✅ ALL CHEATS LOADED SUCCESSFULLY!');
            console.log('🔥 HACKS ARE ACTIVE!');
            console.log('========================================');
            
        } catch(e) {
            console.log('❌ Error loading cheats:', e);
        }
    }
    
    // =============================================
    // START
    // =============================================
    console.log('🔄 Loading configuration...');
    
    loadConfig()
        .then(config => {
            console.log('📋 Configuration:', config);
            
            // Wait before loading
            const delay = config.delay || 3000;
            console.log(`⏳ Waiting ${delay/1000} seconds...`);
            
            setTimeout(() => {
                loadAllCheats(config);
            }, delay);
        })
        .catch(error => {
            console.log('❌ Error:', error);
        });
    
})();
