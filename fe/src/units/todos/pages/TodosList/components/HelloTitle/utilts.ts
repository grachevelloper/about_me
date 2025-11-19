export function getTimeOfDay(name: string): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        const randomSticker =
            MORNINGS_STICKERS[
                Math.floor(Math.random() * MORNINGS_STICKERS.length)
            ];
        return `Доброе утро, ${name} ${randomSticker}`;
    }
    if (hour >= 12 && hour < 17) {
        const randomSticker =
            DAYS_STICKERS[Math.floor(Math.random() * DAYS_STICKERS.length)];
        return `Добрый день, ${name} ${randomSticker}`;
    }
    if (hour >= 17 && hour < 23) {
        const randomSticker =
            EVENINGS_STICKERS[
                Math.floor(Math.random() * EVENINGS_STICKERS.length)
            ];
        return `Добрый вечер, ${name} ${randomSticker}`;
    }
    const randomSticker =
        NIGHTS_STICKERS[Math.floor(Math.random() * NIGHTS_STICKERS.length)];
    return `Доброй ночи, ${name} ${randomSticker}`;
}

const MORNINGS_STICKERS = ['☀️', '🌞', '🌅', '🌄', '🌇', '🌆', '☕'];
const DAYS_STICKERS = ['💼', '📚', '📖', '✏️', '📝', '💻'];
const EVENINGS_STICKERS = ['🌇', '🌆', '🌃', '🎵', '🎸'];
const NIGHTS_STICKERS = ['🌙', '🌚', '🌕', '💤', '🌜'];
