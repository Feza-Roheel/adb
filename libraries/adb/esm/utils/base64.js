// Prepare maps for O(1) searching
const charToIndex = {};
const indexToChar = [];
const paddingChar = '='.charCodeAt(0);
function addRange(start, end) {
    const charCodeStart = start.charCodeAt(0);
    const charCodeEnd = end.charCodeAt(0);
    for (let charCode = charCodeStart; charCode <= charCodeEnd; charCode += 1) {
        charToIndex[String.fromCharCode(charCode)] = indexToChar.length;
        indexToChar.push(charCode);
    }
}
addRange('A', 'Z');
addRange('a', 'z');
addRange('0', '9');
addRange('+', '+');
addRange('/', '/');
export function calculateBase64EncodedLength(inputLength) {
    const remainder = inputLength % 3;
    const paddingLength = remainder !== 0 ? 3 - remainder : 0;
    return [(inputLength + paddingLength) / 3 * 4, paddingLength];
}
export function encodeBase64(input, output) {
    const [outputLength, paddingLength] = calculateBase64EncodedLength(input.length);
    if (!output) {
        output = new Uint8Array(outputLength);
        encodeForward(input, output, paddingLength);
        return output;
    }
    else {
        if (output.length < outputLength) {
            throw new Error('output buffer is too small');
        }
        output = output.subarray(0, outputLength);
        // When input and output are on same ArrayBuffer,
        // we check if it's possible to encode in-place.
        if (input.buffer !== output.buffer) {
            encodeForward(input, output, paddingLength);
        }
        else if (output.byteOffset + output.length - (paddingLength + 1) <= input.byteOffset + input.length) {
            // Output ends before input ends
            // So output won't catch up with input.
            // Depends on padding length,
            // it's possible to write 1-3 bytes after input ends.
            // spell: disable-next-line
            // | aaaaaabb |          |          |          |
            // |  aaaaaa  |  bb0000  |    =     |    =     |
            //
            // spell: disable-next-line
            // | aaaaaabb | bbbbcccc |          |          |
            // |  aaaaaa  |  bbbbbb  |  cccc00  |    =     |
            //
            // spell: disable-next-line
            // | aaaaaabb | bbbbcccc | ccdddddd |          |
            // |  aaaaaa  |  bbbbbb  |  cccccc  |  dddddd  |
            // Must encode forwards.
            encodeForward(input, output, paddingLength);
        }
        else if (output.byteOffset >= input.byteOffset - 1) {
            // Output starts after input starts
            // So in backwards, output can't catch up with input.
            // Because first 3 bytes becomes 4 bytes,
            // it's possible to write 1 byte before input starts.
            // spell: disable-next-line
            // |          | aaaaaabb | bbbbcccc | ccdddddd |
            // |  aaaaaa  |  bbbbbb  |  cccccc  |  dddddd  |
            // Must encode backwards.
            encodeBackward(input, output, paddingLength);
        }
        else {
            // Input is in the middle of output,
            // not possible to read neither first or last three bytes,
            throw new Error('input and output cannot overlap');
        }
        return outputLength;
    }
}
function encodeForward(input, output, paddingLength) {
    let inputIndex = 0;
    let outputIndex = 0;
    while (inputIndex < input.length - 2) {
        /* cspell: disable-next-line */
        // aaaaaabb
        const x = input[inputIndex];
        inputIndex += 1;
        /* cspell: disable-next-line */
        // bbbbcccc
        const y = input[inputIndex];
        inputIndex += 1;
        /* cspell: disable-next-line */
        // ccdddddd
        const z = input[inputIndex];
        inputIndex += 1;
        output[outputIndex] = indexToChar[x >> 2];
        outputIndex += 1;
        output[outputIndex] = indexToChar[((x & 0b11) << 4) | (y >> 4)];
        outputIndex += 1;
        output[outputIndex] = indexToChar[((y & 0b1111) << 2) | (z >> 6)];
        outputIndex += 1;
        output[outputIndex] = indexToChar[z & 0b111111];
        outputIndex += 1;
    }
    if (paddingLength === 2) {
        /* cspell: disable-next-line */
        // aaaaaabb
        const x = input[inputIndex];
        inputIndex += 1;
        output[outputIndex] = indexToChar[x >> 2];
        outputIndex += 1;
        output[outputIndex] = indexToChar[((x & 0b11) << 4)];
        outputIndex += 1;
        output[outputIndex] = paddingChar;
        outputIndex += 1;
        output[outputIndex] = paddingChar;
    }
    else if (paddingLength === 1) {
        /* cspell: disable-next-line */
        // aaaaaabb
        const x = input[inputIndex];
        inputIndex += 1;
        /* cspell: disable-next-line */
        // bbbbcccc
        const y = input[inputIndex];
        inputIndex += 1;
        output[outputIndex] = indexToChar[x >> 2];
        outputIndex += 1;
        output[outputIndex] = indexToChar[((x & 0b11) << 4) | (y >> 4)];
        outputIndex += 1;
        output[outputIndex] = indexToChar[((y & 0b1111) << 2)];
        outputIndex += 1;
        output[outputIndex] = paddingChar;
    }
}
function encodeBackward(input, output, paddingLength) {
    let inputIndex = input.length - 1;
    let outputIndex = output.length - 1;
    if (paddingLength === 2) {
        /* cspell: disable-next-line */
        // aaaaaabb
        const x = input[inputIndex];
        inputIndex -= 1;
        output[outputIndex] = paddingChar;
        outputIndex -= 1;
        output[outputIndex] = paddingChar;
        outputIndex -= 1;
        output[outputIndex] = indexToChar[((x & 0b11) << 4)];
        outputIndex -= 1;
        output[outputIndex] = indexToChar[x >> 2];
        outputIndex -= 1;
    }
    else if (paddingLength === 1) {
        /* cspell: disable-next-line */
        // bbbbcccc
        const y = input[inputIndex];
        inputIndex -= 1;
        /* cspell: disable-next-line */
        // aaaaaabb
        const x = input[inputIndex];
        inputIndex -= 1;
        output[outputIndex] = paddingChar;
        outputIndex -= 1;
        output[outputIndex] = indexToChar[((y & 0b1111) << 2)];
        outputIndex -= 1;
        output[outputIndex] = indexToChar[((x & 0b11) << 4) | (y >> 4)];
        outputIndex -= 1;
        output[outputIndex] = indexToChar[x >> 2];
        outputIndex -= 1;
    }
    while (inputIndex >= 0) {
        /* cspell: disable-next-line */
        // ccdddddd
        const z = input[inputIndex];
        inputIndex -= 1;
        /* cspell: disable-next-line */
        // bbbbcccc
        const y = input[inputIndex];
        inputIndex -= 1;
        /* cspell: disable-next-line */
        // aaaaaabb
        const x = input[inputIndex];
        inputIndex -= 1;
        output[outputIndex] = indexToChar[z & 0b111111];
        outputIndex -= 1;
        output[outputIndex] = indexToChar[((y & 0b1111) << 2) | (z >> 6)];
        outputIndex -= 1;
        output[outputIndex] = indexToChar[((x & 0b11) << 4) | (y >> 4)];
        outputIndex -= 1;
        output[outputIndex] = indexToChar[x >> 2];
        outputIndex -= 1;
    }
}
export function decodeBase64(input) {
    let padding;
    if (input[input.length - 2] === '=') {
        padding = 2;
    }
    else if (input[input.length - 1] === '=') {
        padding = 1;
    }
    else {
        padding = 0;
    }
    const result = new Uint8Array(input.length / 4 * 3 - padding);
    let sIndex = 0;
    let dIndex = 0;
    while (sIndex < input.length - (padding !== 0 ? 4 : 0)) {
        const a = charToIndex[input[sIndex]];
        sIndex += 1;
        const b = charToIndex[input[sIndex]];
        sIndex += 1;
        const c = charToIndex[input[sIndex]];
        sIndex += 1;
        const d = charToIndex[input[sIndex]];
        sIndex += 1;
        result[dIndex] = (a << 2) | ((b & 48) >> 4);
        dIndex += 1;
        result[dIndex] = ((b & 0b1111) << 4) | ((c & 60) >> 2);
        dIndex += 1;
        result[dIndex] = ((c & 0b11) << 6) | d;
        dIndex += 1;
    }
    if (padding === 1) {
        const a = charToIndex[input[sIndex]];
        sIndex += 1;
        const b = charToIndex[input[sIndex]];
        sIndex += 1;
        const c = charToIndex[input[sIndex]];
        result[dIndex] = (a << 2) | ((b & 48) >> 4);
        dIndex += 1;
        result[dIndex] = ((b & 0b1111) << 4) | ((c & 60) >> 2);
    }
    else if (padding === 2) {
        const a = charToIndex[input[sIndex]];
        sIndex += 1;
        const b = charToIndex[input[sIndex]];
        result[dIndex] = (a << 2) | ((b & 48) >> 4);
    }
    return result;
}
//# sourceMappingURL=base64.js.map