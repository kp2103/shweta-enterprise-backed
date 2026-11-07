import crypto from 'node:crypto'

export function generateRandomPassword()
{
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;
    
    // Guarantee at least one character from each category
    const passwordArray = [
        lowercase[crypto.randomInt(0, lowercase.length)],
        uppercase[crypto.randomInt(0, uppercase.length)],
        numbers[crypto.randomInt(0, numbers.length)],
        symbols[crypto.randomInt(0, symbols.length)]
    ];

    // Fill the rest of the array with random characters from the combined pool
    for (let i = passwordArray.length; i < length; i++) {
        passwordArray.push(allChars[crypto.randomInt(0, allChars.length)]);
    }

    // Securely shuffle the array (Fisher-Yates algorithm) so the first 4 characters aren't predictable
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        // Swap elements
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    return passwordArray.join('');
}