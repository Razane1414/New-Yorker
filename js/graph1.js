// Variable globale pour l'élément Snap
let svgBarreId = Snap("#svgBarre");
let animationDone = false; // pour vérifier si l'animation a déjà été faite


// FONCTION POUR CHARGER LE SVG
function chargerSvg() {
    Snap.load("images/graph_borne_vrai.svg", function (loadedFragment) {
        svgBarreId.append(loadedFragment);
        initGraph1(); // initialiser le graphique après le chargement du SVG
    });
}

// FONCTION DES BARRE (de bas en haut)
function animerBarres() {
    if (!svgBarreId || animationDone) return;
    // selectionner les rect (barres)
    let barres = svgBarreId.selectAll("rect");

    // Animer chaque barre
    barres.forEach(function(barre) {
        let initialHeight = barre.attr("height");
        let y = barre.attr("y");

        barre.attr({ height: 0, y: parseFloat(y) + parseFloat(initialHeight) });
        // Animer vers la hauteur d'origine et la position initiale
        barre.animate(
            { height: initialHeight, y: y },
            2000, // durée animation
            mina.easeinout 
        );
    });
    animationDone = true; //  true = animation comme terminée
}


// FONCTION POUR OBSERVER LA SECTION (PUIS METTRE L'ANIMATION EN CONSEQUENCE)
function observerSection() {
    let graphSection = document.querySelector("#svgBarre");

    let observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !animationDone) {
                    // Lancer l'animation quand la section est visible
                    animerBarres();
                }
            });
        },
        { threshold: 0.5 } // Déclenchement lorsque 50% de la section est visible
    );
    observer.observe(graphSection); // Observer la section du graphique
}



// FONCTION POUR REINITIALISER LA BARRE DE LA BATTERIE
function reinitialiserBatterie() {
    let batterie = svgBarreId.select("#batterie");
    batterie.animate({ 
        height: 17.25, 
        y: 101.57 // Ajuste la position y à la hauteur par défaut
    }, 300); // hauteur par défaut
}


// FONCTION POUR AJUSTER LA BATTERIE EN FONCTION DE LA BARRE SURVOLEE
function ajusterBatterie(rect, batterie) {
    let height = rect.attr("height");
    let newHeight;

    // Ajuster la hauteur en fonction de la barre survolée
    if (height <= 42.31) {
        newHeight = 2; // rectangle_1
    } else if (height <= 82.06) {
        newHeight = 5; // rectangle_2
    } else if (height <= 102.58) {
        newHeight = 10; // rectangle_3
    } else if (height <= 173.67) {
        newHeight = 15; // rectangle_4
    } else {
        newHeight = 17.25; // rectangle_5
    }

    // Nouvelle position y pour garder le bas fixe
    let originalY = parseFloat(batterie.attr("y")); // Y original de la batterie
    let heightDiff = parseFloat(batterie.attr("height")) - newHeight; // différence de hauteur

    // Animer la batterie
    batterie.animate(
        { 
            height: newHeight, 
            y: originalY + heightDiff 
        }, 
        300 // durée
    );
}

// Initialiser le graphique au chargement de la page
function initGraph1() {
    // Observer la section pour l'animation
    observerSection();

    let rects = svgBarreId.selectAll("rect"); // tous les rectangles
    let batterie = svgBarreId.select("#batterie"); // le rectangle de la batterie

    // Gérer les événements de survol
    rects.forEach(function(rect) {
        rect.hover(
            function() { 
                // Changer la hauteur de la batterie selon le rectangle survolé
                ajusterBatterie(rect, batterie);
            },
            function() { 
                //  la hauteur de la batterie si le survol n'est plus actif
                reinitialiserBatterie();
            }
        );
    });
}


window.addEventListener("load", chargerSvg);
