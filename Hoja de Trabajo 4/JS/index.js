function showItinerary(tipo) {
    const tablas = document.querySelectorAll('.itinerary-table');
    tablas.forEach(tabla => {
        tabla.classList.remove('active');
    });
    
    const tablaSeleccionada = document.getElementById('itinerario-' + tipo);
    if (tablaSeleccionada) {
        setTimeout(() => {
            tablaSeleccionada.classList.add('active');
        }, 200);
    }
    
    const botones = document.querySelectorAll('.btn-itinerary');
    botones.forEach(boton => {
        boton.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

const comentarios = [
    "¡Increíble experiencia en Spa-Francorchamps! La curva Eau Rouge es aún más impresionante en persona. El rugido de los motores V6 es indescriptible.",
    "El GP de Bélgica superó todas mis expectativas. Ver a Verstappen dominar en Raidillon fue épico. Las vistas desde la tribuna VIP son perfectas.",
    "Mi primera vez en un Gran Premio de F1 y elegí el mejor. Spa es legendario, la lluvia hizo la carrera aún más emocionante. ¡Volveré sin dudas!",
    "El tour por el paddock fue fascinante. Conocer a los mecánicos y ver los coches de cerca es una experiencia única. El servicio VIP fue excepcional.",
    "Bélgica no solo tiene el mejor circuito, sino también la mejor cerveza y chocolate. La combinación perfecta para un fin de semana de F1.",
    "Las 44 curvas de Spa-Francorchamps son pura adrenalina. Ver cómo los pilotos toman Pouhon a más de 300 km/h es simplemente increíble.",
    "La experiencia premium valió cada euro. El desayuno con pilotos, el acceso al paddock y la suite privada hicieron de este el mejor fin de semana de mi vida.",
    "Spa tiene una magia especial. La historia de este circuito se siente en cada curva. Ver pasar a Hamilton por Kemmel fue un momento inolvidable.",
    "La organización fue perfecta. Desde el transporte hasta la comida, todo estuvo a la altura de la Fórmula 1. El personal conocía cada detalle del deporte.",
    "Nunca pensé que la F1 en vivo sería tan diferente a la TV. Los adelantamientos en Les Combes son espectaculares. La velocidad es impresionante.",
    "El clima belga nos regaló una carrera épica. Ver cómo los pilotos manejan en condiciones mixtas desde la tribuna principal fue educativo y emocionante.",
    "Recomiendo esta experiencia a cualquier fanático de la F1. El acceso VIP te hace sentir parte del paddock. Los recuerdos durarán para siempre.",
    "Brujas después del Gran Premio fue el broche de oro perfecto. La combinación de adrenalina F1 y cultura belga es imbatible.",
    "Mi hijo de 12 años quedó fascinado con todo. Desde el simulador hasta conocer a los pilotos. Una experiencia familiar perfecta para crear futuros fanáticos."
];

const nombres = [
    "Max Enthoven",
    "Isabella Ferrari",
    "Carlos Hamilton",
    "Sophie Leclerc",
    "Michael Verstappen",
    "Emma Bottas",
    "Alessandro Vettel",
    "Marie Gasly",
    "Fernando Alonso Jr.",
    "Charlotte Russell",
    "Sebastian Norris",
    "Valentina Sainz",
    "Lewis Pérez",
    "Camille Ocon"
];

function shuffleArray(array) {
    const newArray = [...array]; 
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getRandomUniqueElements(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, count);
}

function loadRandomComments() {
    const container = document.getElementById('comentarios-container');
    
    container.innerHTML = `
        <div class="col-12 loading-comments">
            <i class="fas fa-car-side fa-spin"></i>
            <p class="mt-2">Cargando comentarios de fanáticos...</p>
        </div>
    `;
    
    setTimeout(() => {
        const comentariosSeleccionados = getRandomUniqueElements(comentarios, 3);
        const nombresSeleccionados = getRandomUniqueElements(nombres, 3);
        
        container.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const comentarioCard = document.createElement('div');
            comentarioCard.className = 'col-md-4 col-sm-6 mb-3';
            
            // Generar estrellas aleatorias (4-5 estrellas)
            const rating = Math.floor(Math.random() * 2) + 4; // 4 o 5 estrellas
            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            
            comentarioCard.innerHTML = `
                <div class="card comment-card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="comment-author mb-2">
                            <i class="fas fa-helmet-safety"></i> ${nombresSeleccionados[i]}
                        </div>
                        <div class="comment-text flex-grow-1">
                            ${comentariosSeleccionados[i]}
                        </div>
                        <div class="mt-3 d-flex justify-content-between align-items-center">
                            <small class="text-warning">
                                ${stars}
                            </small>
                            <small class="opacity-75">
                                <i class="fas fa-flag-checkered"></i> Fan F1
                            </small>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(comentarioCard);
        }
        
        const cards = container.querySelectorAll('.comment-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-50px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 300); 
        });
        
    }, 1200); 
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm() {
    const nombre = document.getElementById('nombre').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    let isValid = true;
    const errors = [];
    
    if (!nombre) {
        errors.push('El nombre es requerido');
        isValid = false;
    } else if (nombre.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    if (!fechaNacimiento) {
        errors.push('La fecha de nacimiento es requerida');
        isValid = false;
    } else {
        const today = new Date();
        const birthDate = new Date(fechaNacimiento);
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 5) {
            errors.push('Debes tener al menos 5 años para asistir a la F1');
            isValid = false;
        } else if (age > 120) {
            errors.push('Por favor ingresa una fecha de nacimiento válida');
            isValid = false;
        }
    }
    
    if (!email) {
        errors.push('El correo electrónico es requerido');
        isValid = false;
    } else if (!isValidEmail(email)) {
        errors.push('El formato del correo electrónico no es válido');
        isValid = false;
    }
    
    if (!mensaje) {
        errors.push('El mensaje es requerido');
        isValid = false;
    } else if (mensaje.length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    return { isValid, errors, data: { nombre, fechaNacimiento, email, mensaje } };
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function showConfirmationModal(formData) {
    const edad = calculateAge(formData.fechaNacimiento);
    
    const datosContainer = document.getElementById('datosEnviados');
    datosContainer.innerHTML = `
        <div class="card border-success">
            <div class="card-header bg-success text-white">
                <i class="fas fa-user-check"></i> Datos de la Reserva F1
            </div>
            <div class="card-body">
                <p><strong><i class="fas fa-user"></i> Nombre:</strong> ${formData.nombre}</p>
                <p><strong><i class="fas fa-birthday-cake"></i> Edad:</strong> ${edad} años</p>
                <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${formData.email}</p>
                <p><strong><i class="fas fa-comment-dots"></i> Mensaje:</strong></p>
                <div class="alert alert-light">
                    ${formData.mensaje}
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
    
    console.log('=== RESERVA EXPERIENCIA F1 BÉLGICA ===');
    console.log('Nombre completo:', formData.nombre);
    console.log('Fecha de nacimiento:', formData.fechaNacimiento);
    console.log('Edad calculada:', edad + ' años');
    console.log('Correo electrónico:', formData.email);
    console.log('Mensaje/Preferencias:', formData.mensaje);
    console.log('Timestamp:', new Date().toISOString());
    console.log('==========================================');
}

document.addEventListener('DOMContentLoaded', function() {
    loadRandomComments();
    
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const validation = validateForm();
        
        form.classList.add('was-validated');
        
        if (validation.isValid) {
            showConfirmationModal(validation.data);
            
            setTimeout(() => {
                form.reset();
                form.classList.remove('was-validated');
            }, 2000);
            
        } else {
            console.error('Errores de validación:', validation.errors);
            
            alert('Por favor corrige los siguientes errores:\n\n' + validation.errors.join('\n'));
        }
    });
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (form.classList.contains('was-validated')) {
                validateForm();
            }
        });
        
        input.addEventListener('input', function() {
            if (form.classList.contains('was-validated')) {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    showItinerary('circuito');
    
    const buttons = document.querySelectorAll('.btn-itinerary');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});


function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        locale: 'es-ES'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function showLoadingProgress(container, message = 'Cargando...') {
    container.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">${message}</span>
            </div>
            <p class="mt-2 text-danger">${message}</p>
        </div>
    `;
}


let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(event) {
    konamiCode.push(event.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        document.body.style.filter = 'hue-rotate(180deg)';
        alert('🏁 ¡Código F1 activado! ¡Modo night race habilitado! 🏎️');
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
        
        konamiCode = [];
    }
});