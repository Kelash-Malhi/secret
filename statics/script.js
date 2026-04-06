const MORSE_MAP = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
    H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
    O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
    V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
    5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.',
    '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
    '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.'
};
const MORSE_REVERSE_MAP = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

const LEET_MAP = {
    a: '4', b: '8', c: '(', d: '|)', e: '3', f: '|=', g: '6',
    h: '#', i: '1', j: '_|', k: '|<', l: '1', m: '/\\/\\', n: '|\\|',
    o: '0', p: '|*', q: '0_', r: '|2', s: '5', t: '7', u: '|_|',
    v: '\\/', w: '\\/\\/', x: '><', y: '`/', z: '2'
};
const LEET_REVERSE_MAP = Object.fromEntries(Object.entries(LEET_MAP).map(([k, v]) => [v, k]));

const EMOJI_MAP = {
    hello: '👋', love: '❤️', python: '🐍', code: '💻', fire: '🔥', star: '⭐',
    sun: '☀️', moon: '🌙', happy: '😊', sad: '😢', cool: '😎', idea: '💡',
    music: '🎵', party: '🎉', food: '🍔', book: '📚', time: '⏰', ok: '👌',
    yes: '✅', no: '❌'
};
const EMOJI_REVERSE_MAP = Object.fromEntries(Object.entries(EMOJI_MAP).map(([k, v]) => [v, k]));

function textToMorse(text) {
    return text.toUpperCase().split(' ').map((word) =>
        [...word].filter((ch) => MORSE_MAP[ch]).map((ch) => MORSE_MAP[ch]).join(' ')
    ).join(' / ');
}

function morseToText(morse) {
    return morse.split(' / ').map((word) =>
        word.trim().split(/\s+/).filter(Boolean).map((code) => MORSE_REVERSE_MAP[code] || '?').join('')
    ).join(' ');
}

function textToLeet(text) {
    return [...text].map((ch) => LEET_MAP[ch.toLowerCase()] || ch).join('');
}

function leetToText(leet) {
    const tokens = Object.keys(LEET_REVERSE_MAP).sort((a, b) => b.length - a.length);
    let i = 0;
    let out = '';

    while (i < leet.length) {
        let matched = false;
        for (const token of tokens) {
            if (leet.slice(i, i + token.length) === token) {
                out += LEET_REVERSE_MAP[token];
                i += token.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            out += leet[i];
            i += 1;
        }
    }
    return out;
}

function textToAscii(text) {
    return [...text].map((ch) => ch.codePointAt(0)).join(' ');
}

function asciiToText(asciiCodes) {
    return asciiCodes.replaceAll(',', ' ').split(/\s+/).filter(Boolean).map((code) => {
        const n = Number(code);
        return Number.isInteger(n) && n >= 0 && n <= 1114111 ? String.fromCodePoint(n) : '?';
    }).join('');
}

function textToEmoji(text) {
    return text.split(/\s+/).map((word) => EMOJI_MAP[word.toLowerCase()] || word).join(' ');
}

function emojiToText(input) {
    return input.split(/\s+/).map((token) => EMOJI_REVERSE_MAP[token] || token).join(' ');
}

function convertValue(type, mode, input) {
    const converters = {
        morse: { encode: textToMorse, decode: morseToText },
        leet: { encode: textToLeet, decode: leetToText },
        ascii: { encode: textToAscii, decode: asciiToText },
        emoji: { encode: textToEmoji, decode: emojiToText }
    };

    return converters[type]?.[mode]?.(input) ?? 'Unsupported converter';
}

function initConverter() {
    const converter = document.querySelector('.converter');
    if (!converter) return;

    const type = converter.dataset.type;
    const inputEl = document.getElementById('inputText');
    const outputBox = document.getElementById('outputBox');

    document.querySelectorAll('.controls button').forEach((btn) => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            const value = inputEl.value || '';
            outputBox.textContent = convertValue(type, mode, value);
        });
    });
}

document.addEventListener('DOMContentLoaded', initConverter);
