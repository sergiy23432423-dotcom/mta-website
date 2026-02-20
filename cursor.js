/**
 * Custom Cursor Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'custom-cursor-outline';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Smooth movement constants
    const speed = 0.2; // Speed of the outline (lower = slower/smoother)

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate movement for the inner dot
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Animation loop for smooth outline movement
    function animate() {
        // Calculate smooth movement for outline
        let distX = mouseX - outlineX;
        let distY = mouseY - outlineY;

        outlineX = outlineX + (distX * speed);
        outlineY = outlineY + (distY * speed);

        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects for interactive elements
    const interactiveElements = 'a, button, .wiki-card, .feature-card, input, select, textarea, .gallery-item';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            // Check if we are really leaving or just entering a child
            const related = e.relatedTarget;
            if (!related || !related.closest(interactiveElements)) {
                document.body.classList.remove('cursor-hover');
            }
        }
    });

    // Click effects
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-clicking');
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-clicking');
    });

    // Handle cursor visibility when leaving/entering window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
});
