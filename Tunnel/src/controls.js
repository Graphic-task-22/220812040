export function setupControls(onRight, onLeft, onClick) {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            onRight();
        } else if (event.key === 'ArrowLeft') {
            onLeft();
        }
    });

    document.addEventListener('click', () => {
        onClick();
    });
}
