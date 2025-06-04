"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
/**
 * Преобразует строку в URL-совместимый slug
 * @param text Исходный текст
 * @returns Строка в формате slug
 */
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Заменяет пробелы на дефисы
        .replace(/[^\w\-]+/g, '') // Удаляет все не-буквенно-цифровые символы
        .replace(/\-\-+/g, '-') // Заменяет множественные дефисы на один
        .replace(/^-+/, '') // Удаляет дефисы в начале
        .replace(/-+$/, '') // Удаляет дефисы в конце
        .replace(/[^\x00-\x7F]/g, ''); // Удаляет не-ASCII символы
}
