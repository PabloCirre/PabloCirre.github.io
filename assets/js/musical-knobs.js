/**
 * Musical Knobs - Web Audio API Synthesizer
 * Click on knobs to play musical notes with echo effect
 */

// Initialize Audio Context
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Play note with echo/delay effect
function playNoteWithEcho(frequency, duration = 0.8) {
    const ctx = initAudioContext();
    const now = ctx.currentTime;

    // Create oscillator (main tone)
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);

    // Create gain node for envelope (ADSR)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.1);
    gainNode.gain.setValueAtTime(0.2, now + duration - 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Create delay node (echo effect)
    const delayNode = ctx.createDelay();
    delayNode.delayTime.value = 0.3;

    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.5;

    const feedbackGain = ctx.createGain();
    feedbackGain.gain.value = 0.4;

    // Create filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(ctx.destination);

    // Connect delay chain
    filter.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(ctx.destination);

    // Feedback loop
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);

    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + duration + 1);
}

// Setup knob click handlers
document.addEventListener('DOMContentLoaded', function () {
    const knobPanels = document.querySelectorAll('.knob-panel');

    knobPanels.forEach(panel => {
        const knob = panel.querySelector('.musical-knob');
        const frequency = parseFloat(panel.dataset.frequency);
        const noteName = panel.dataset.note;

        if (knob && frequency) {
            knob.addEventListener('click', function (e) {
                e.stopPropagation();
                knob.classList.add('active', 'playing');
                playNoteWithEcho(frequency);
                console.log(`%c ♪ Playing: ${noteName} (${frequency.toFixed(2)} Hz)`,
                    'color: #00ffcc; font-family: monospace; font-size: 14px;');
                setTimeout(() => {
                    knob.classList.remove('active', 'playing');
                }, 1200);
            });

            panel.addEventListener('click', function () {
                knob.click();
            });
        }
    });

    console.log('%c 🎹 Musical Knobs Widget: READY ',
        'background: #00ffcc; color: #000; font-family: monospace; padding: 5px; font-weight: bold;');
});
