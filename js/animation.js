// Variable globale
let isTextVisible = false; // Suivi de l'état du texte

// FONCTION POUR CACHER LE TEXTE AU DÉPART
function hideText() {
    gsap.set(".rightContainer .textArticle", { opacity: 0, x: -50, display: "none" }); //  x à -50 pour le cacher à gauche
}

// FONCTION POUR L'ANIMATION
function animateText(visible) {
    if (visible) {
        // Animation pour afficher le texte avec un effet élastique
        gsap.to(".rightContainer .textArticle", {
            opacity: 1,
            x: 0,  // Revenir à la position initiale (au centre)
            display: "block",
            duration: 1.2,
            ease: "elastic.out(1, 0.75)"
        });
    } else {
        // Animation pour cacher le texte en le déplaçant à gauche
        gsap.to(".rightContainer .textArticle", {
            opacity: 0,
            x: -50,  // Glisse vers la gauche
            display: "none",
            duration: 0.8,
            ease: "power2.in"
        });
    }
}


// FONCTION POUR LE SCROLL FLUIDE VERS UNE SECTION
function scrollToSection() {
    let navLinks = document.querySelectorAll(".nav-links a"); // Sélectionner tous les liens de navigation

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // empeche comportement par defaut de saut direct

            let targetID = this.getAttribute("href"); 
            let targetSection = document.querySelector(targetID); 

            // Utilisatio de GSAP pour creer une animation de defilement fluide
            gsap.to(window, {
                scrollTo: targetSection,  //  jusqu'a la section cible
                duration: 1.2,        // Courbe de défilement fluide
            });
        });
    });
}

// FONCTION SURLIGNER TEXTE
function highlightText(textSurligne) {
    let highlightableText = textSurligne.querySelector(".highlightable");
    if (highlightableText) {
        // Créer un élément de surlignage
        let highlight = document.createElement("span");
        highlight.className = "highlight"; // appliquer la classe de surlignage du css
        highlightableText.appendChild(highlight); // ajt le surlignage au texte

        // obtenir la largeur du texte surligné
        let textWidth = highlightableText.offsetWidth;

        //  GSAP pour animer le surlignage de gauche à droite
        gsap.to(highlight, {
            duration: 1.5, 
            width: textWidth, // etendre à la largeur du texte
            ease: "power2.out" 
        });
    }
}

// FONCTION OBSERVER SECTION
function observeSection(section) {
    let observerOptions = {
        root: null, // viewport
        threshold: 0.5 // quand 50% de la section est visible
    };

    let observerCallback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                highlightText(entry.target.querySelector(".surligner"));
                observer.unobserve(entry.target); // arreter l'observation après l'animation
            }
        });
    };

    let observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(section);
}



// Initialisation des animations
function initAnimation() {
  let btnPlus = document.getElementById("btnPlus");

  hideText(); // cacher le texte au départ

  // Ajouter un événement pour l'animation du texte au clic sur le bouton
  btnPlus.addEventListener("click", function () {
      animateText(!isTextVisible);

      // changer le texte du bouton en fonction de l'état
      btnPlus.textContent = isTextVisible ? "+" : "-";

      // inverser l'état
      isTextVisible = !isTextVisible;
  });

  //  animation de defilement fluide
  scrollToSection();

  // Observer la section de croissance
  let sectionToObserveGrowth = document.getElementById("growth");
  let textToHighlightGrowth = document.querySelector(".surligner");

  let sectionToObserveEvolution = document.getElementById("evolution");
  let textToHighlightEvolution = sectionToObserveEvolution.querySelector(".surligner");

  observeSection(sectionToObserveGrowth, textToHighlightGrowth);
  observeSection(sectionToObserveEvolution, textToHighlightEvolution);
}


window.addEventListener("load", initAnimation);
