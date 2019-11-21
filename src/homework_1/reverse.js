process.stdin.on('data', data => {
    const result = reverse(data.toString().trim());
    process.stdout.write(`${result}\n\n\n`);
});

function reverse(value) {
    return value.split('').reverse().join('');
}
