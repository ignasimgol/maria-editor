// Pantalla de carga y video principal
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const mainVideo = document.getElementById('main-video');
    
    // Función para ocultar la pantalla de carga
    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        mainContent.classList.add('loaded');
        
        // Remover la pantalla de carga del DOM después de la transición
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // Esperar a que el video esté listo para reproducir
    if (mainVideo) {
        mainVideo.addEventListener('canplaythrough', function() {
            // Pequeño delay para asegurar que todo esté cargado
            setTimeout(hideLoadingScreen, 300);
        });
        
        // Fallback: ocultar después de 5 segundos máximo
        setTimeout(hideLoadingScreen, 5000);
    } else {
        // Si no hay video, ocultar después de 1 segundo
        setTimeout(hideLoadingScreen, 1000);
    }
    
    // Animación de entrada suave
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Inicializar animaciones
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Efecto hover mejorado para el grid
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        imageObserver.observe(img);
    });
});

// Función para scroll suave (si se añaden enlaces internos)
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}