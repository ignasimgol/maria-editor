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
    
    // Funcionalidad de pantalla completa para todos los videos
    const allVideos = document.querySelectorAll('video');
    
    allVideos.forEach(video => {
        // Agregar evento de doble click para pantalla completa
        video.addEventListener('dblclick', function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });
        
        // Agregar evento de click para activar/desactivar sonido
        video.addEventListener('click', function(e) {
            // Evitar que el doble click interfiera
            if (e.detail === 1) {
                setTimeout(() => {
                    if (e.detail === 1) {
                        video.muted = !video.muted;
                        
                        // Mostrar indicador visual de mute/unmute
                        showVolumeIndicator(video, video.muted);
                    }
                }, 200);
            }
        });
        
        // Controles de teclado cuando el video está en foco
        video.addEventListener('keydown', function(e) {
            switch(e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                    break;
                case 'm':
                    video.muted = !video.muted;
                    showVolumeIndicator(video, video.muted);
                    break;
                case 'f':
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    video.volume = Math.min(1, video.volume + 0.1);
                    showVolumeIndicator(video, false, video.volume);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    video.volume = Math.max(0, video.volume - 0.1);
                    showVolumeIndicator(video, false, video.volume);
                    break;
            }
        });
        
        // Hacer los videos focusables para los controles de teclado
        video.setAttribute('tabindex', '0');
    });
    
    // Función para mostrar indicador de volumen
    function showVolumeIndicator(video, isMuted, volume = null) {
        // Remover indicador existente si existe
        const existingIndicator = video.parentNode.querySelector('.volume-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Crear nuevo indicador
        const indicator = document.createElement('div');
        indicator.className = 'volume-indicator';
        
        if (isMuted) {
            indicator.innerHTML = '🔇 Silenciado';
        } else if (volume !== null) {
            indicator.innerHTML = `🔊 ${Math.round(volume * 100)}%`;
        } else {
            indicator.innerHTML = '🔊 Sonido activado';
        }
        
        // Estilos del indicador
        indicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
        `;
        
        // Agregar al contenedor del video
        video.parentNode.style.position = 'relative';
        video.parentNode.appendChild(indicator);
        
        // Ocultar después de 2 segundos
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 2000);
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

// Funcionalidad del menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const socialLinks = document.getElementById('social-links');
    
    if (hamburgerMenu && socialLinks) {
        hamburgerMenu.addEventListener('click', function() {
            // Toggle clases activas
            hamburgerMenu.classList.toggle('active');
            socialLinks.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        const socialLinksItems = socialLinks.querySelectorAll('.social-link');
        socialLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                socialLinks.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function(event) {
            if (!hamburgerMenu.contains(event.target) && !socialLinks.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                socialLinks.classList.remove('active');
            }
        });
    }
});