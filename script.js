/**
 * ================================================================
 * “继承者” 售后网站 · 雪夜书
 * 脚本：封面启封、彩蛋系统、遗物交互、粒子、背景、音乐控制
 * ================================================================
 */
(function() {
    'use strict';

    // ---------- 1. 封面启封 ----------
    const cover = document.getElementById('cover');
    const unfoldBtn = document.getElementById('unfoldBtn');
    const mainContent = document.getElementById('mainContent');

    unfoldBtn.addEventListener('click', function() {
        cover.classList.add('hidden');
        mainContent.classList.add('visible');
        console.log('🕯️ 信已启封 · 雪夜之约开始……');
        // 尝试播放音乐（如果尚未播放）
        if (!isMusicPlaying) {
            tryPlayMusic();
        }
    });

    cover.addEventListener('click', function(e) {
        if (e.target === cover || e.target.closest('.cover-inner') === cover.querySelector('.cover-inner')) {
            unfoldBtn.click();
        }
    });

    // ---------- 2. 彩蛋系统 ----------
    const eggModal = document.getElementById('eggModal');
    const eggModalBody = document.getElementById('eggModalBody');
    const eggClose = document.getElementById('eggClose');

    const eggData = {
        coin: {
            icon: '🪙',
            title: '一枚银元',
            story: '那枚银元是假的，可你给我的时候，眼神是真的。我把它藏在怀里，贴身放了这么多年，如今它比真银还沉——因为上面沾着你的手温，还有我半生的念想。'
        },
        shanya: {
            icon: '👧',
            title: '善雅',
            story: '她第一次叫我"爸爸"那天，我手里的茶杯差点摔了。你站在门口，笑得比窗外的阳光还亮。那一刻我才明白，有些羁绊比血缘更深——她是你给我的，最温柔的意外。'
        },
        rose: {
            icon: '🌹',
            title: '白蔷薇',
            story: '我从母亲的花园里偷了这枝白蔷薇，放在你窗台。第二天它不见了，我以为是被风吹走了。直到十年后，我在你的日记本里发现了它——压得扁平，却依旧洁白。原来你一直都知道。'
        },
        snow: {
            icon: '❄️',
            title: '雪夜',
            story: '那个雪夜，你第一次没有推开我伸出的手。也是那个雪夜，我决定把余生都给你。壁炉里的火映着你的脸，比任何月光都温柔。从此，每一个雪夜都是我们的纪念日。'
        }
    };

    document.querySelectorAll('.easter-egg').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.dataset.egg;
            const data = eggData[key];
            if (!data) return;
            eggModalBody.innerHTML = `
                <span class="egg-icon">${data.icon}</span>
                <div class="egg-title">${data.title}</div>
                <div class="egg-story">${data.story}</div>
            `;
            eggModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeEggModal() {
        eggModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    eggClose.addEventListener('click', closeEggModal);
    eggModal.addEventListener('click', function(e) {
        if (e.target === eggModal) {
            closeEggModal();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEggModal();
        }
    });

    // ---------- 3. 遗物匣子 ----------
    document.querySelectorAll('.relic-item').forEach(function(item) {
        const btn = item.querySelector('.relic-btn');
        const story = item.querySelector('.relic-story');

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = story.classList.contains('open');
            document.querySelectorAll('.relic-story').forEach(function(s) {
                s.classList.remove('open');
            });
            document.querySelectorAll('.relic-item').forEach(function(i) {
                i.classList.remove('open');
            });
            if (!isOpen) {
                story.classList.add('open');
                item.classList.add('open');
            }
        });
    });

    // ---------- 4. 粒子系统 ----------
    const particlesContainer = document.getElementById('particles-container');
    const PARTICLE_COUNT = 40;

    function createParticle() {
        const el = document.createElement('div');
        el.className = 'particle';
        const size = Math.random() * 4 + 1.5;
        const x = Math.random() * 100;
        const y = Math.random() * 100 + 20;
        const duration = Math.random() * 18 + 16;
        const delay = Math.random() * 12;
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.left = x + '%';
        el.style.top = y + '%';
        el.style.animationDuration = duration + 's';
        el.style.animationDelay = delay + 's';
        const hue = 40 + Math.random() * 20;
        const sat = 60 + Math.random() * 30;
        const lig = 50 + Math.random() * 30;
        el.style.background = `radial-gradient(circle, hsla(${hue}, ${sat}%, ${lig}%, 0.5), hsla(${hue}, ${sat}%, ${lig}%, 0))`;
        particlesContainer.appendChild(el);
        return el;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        createParticle();
    }

    setInterval(() => {
        const existing = particlesContainer.querySelectorAll('.particle');
        if (existing.length < PARTICLE_COUNT) {
            createParticle();
        }
    }, 4000);

    // ---------- 5. Canvas 动态背景 ----------
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0.5,
        mouseY = 0.5;
    let time = 0;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / width;
        mouseY = e.clientY / height;
    });
    document.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        if (touch) {
            mouseX = touch.clientX / width;
            mouseY = touch.clientY / height;
        }
    }, { passive: true });

    function drawBackground() {
        time += 0.004;
        ctx.clearRect(0, 0, width, height);

        const baseGrad = ctx.createRadialGradient(
            width * 0.5, height * 0.4, 0,
            width * 0.5, height * 0.4, Math.max(width, height) * 0.8
        );
        baseGrad.addColorStop(0, '#2d1a14');
        baseGrad.addColorStop(0.5, '#1a0f0b');
        baseGrad.addColorStop(1, '#0c0705');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        const glowX = mouseX * width;
        const glowY = mouseY * height;
        const mouseGlow = ctx.createRadialGradient(
            glowX, glowY, 0,
            glowX, glowY, Math.max(width, height) * 0.5
        );
        mouseGlow.addColorStop(0, 'rgba(201, 168, 76, 0.035)');
        mouseGlow.addColorStop(0.5, 'rgba(201, 168, 76, 0.015)');
        mouseGlow.addColorStop(1, 'rgba(201, 168, 76, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);

        const waveX = width * (0.3 + 0.2 * Math.sin(time * 0.12));
        const waveY = height * (0.3 + 0.2 * Math.cos(time * 0.10 + 1.2));
        const waveGlow = ctx.createRadialGradient(
            waveX, waveY, 0,
            waveX, waveY, Math.max(width, height) * 0.5
        );
        waveGlow.addColorStop(0, 'rgba(180, 130, 60, 0.02)');
        waveGlow.addColorStop(1, 'rgba(180, 130, 60, 0)');
        ctx.fillStyle = waveGlow;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(201, 168, 76, 0.025)';
        for (let i = 0; i < 6; i++) {
            const sx = (Math.sin(i * 2.7 + time * 0.04) * 0.4 + 0.5) * width;
            const sy = (Math.cos(i * 1.9 + time * 0.06 + 0.8) * 0.4 + 0.5) * height;
            const sr = 2 + Math.sin(i + time * 0.4) * 1.5 + 1;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(drawBackground);
    }
    drawBackground();

    // ---------- 6. 控制台彩蛋 ----------
    console.log('%c✦ 雪夜书 · 文廷恩致林清雅 ✦', 'font-size:20px; color:#c9a84c; font-weight:bold; letter-spacing:4px;');
    console.log('%c「蔷薇已落 · 余香未散」', 'font-size:14px; color:#c4b5a5; font-style:italic;');
    console.log('%c点击文中 ✦ 关键词 ✦ 发现隐藏回忆……', 'font-size:12px; color:#8b7355;');
    console.log('%c—— 感谢你翻开这段尘封的故事 ——', 'font-size:12px; color:#6d5a4a;');

    // ---------- 7. 背景音乐控制 ----------
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const musicLabel = document.getElementById('musicLabel');

    bgMusic.volume = 0.3;
    let isMusicPlaying = false;

    function tryPlayMusic() {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicIcon.textContent = '♪';
                musicLabel.textContent = '奏';
                musicToggle.classList.add('playing');
            }).catch(() => {
                console.log('自动播放被阻止，请手动点击音乐按钮');
            });
        }
    }

    musicToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicIcon.textContent = '♫';
            musicLabel.textContent = '静';
            this.classList.remove('playing');
        } else {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicIcon.textContent = '♪';
                musicLabel.textContent = '奏';
                this.classList.add('playing');
            }).catch(() => {
                console.log('播放失败，请检查MP3文件是否存在');
            });
        }
    });

    // 页面加载完成后预加载
    window.addEventListener('load', function() {
        bgMusic.load();
        // 如果用户之前有交互，可以尝试播放，但这里不自动播放，等待用户操作
    });

})();