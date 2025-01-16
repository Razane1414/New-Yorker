// Variable globale 
let svgTauxId = Snap("#svgTaux");
let animationDoneGraph2 = false; // pour vérifier si l'animation a déjà été faite

// FONCTION POUR CHARGER LE SVG 2
function chargerSvg2() {
    Snap.load("images/graph_taux.svg", function (loadedFragment) {
        svgTauxId.append(loadedFragment);
        initGraph2(); // Appeler l'init après le chargement
    });
}


// FONCTION QUI REND INVISIBLE UN ELEMENT
function rendreInvisible(elements) {
    if (elements) { // verfier si elements n'est pas nul 
        elements.forEach(function(element) {
            element.attr({ opacity: 0 }); // rendre l'élément invisible
        });
    }
}

// FONCTION QUI REND VISIBLE UN ELEMENT
function showElements(elements) {
    elements.forEach(function(element) {
        element.attr({ opacity: 1 }); // Rendre l'élément visible
    });
}

// Fonction pour animer les polylines (trait du graph) avec un effet de rideau
function animatePolylines(polylineLineWhite, polylineLineBlue) {
    // Ne pas rEexécuter si l'animation est déjà faite
    if (animationDoneGraph2) return;

    // Appliquer l'animation sur les polylines (effet rideau)
    [polylineLineWhite, polylineLineBlue].forEach((polyline) => {
        // Obtenir la longueur totale du tracé
        let totalLength = polyline.getTotalLength();

        // Initialiser les attributs pour l'animation
        polyline.attr({
            "stroke-dasharray": totalLength,   // Longueur des tirets et des espaces
            "stroke-dashoffset": totalLength,   // Décalage du trait
            opacity: 1                          // (visible)
        });

        // Animation pour révéler le tracé
        polyline.animate({ "stroke-dashoffset": 0 }, 2000, mina.easeinout); // 2 secondes
    });

    // Marquer l'animation comme effectuée
    animationDoneGraph2 = true;
}



// Initialiser les événements et assigner la fonction au bouton
function initGraph2() {

    // selectionner tous les éléments de texte et cercles à afficher
    let textSmallWhite = svgTauxId.selectAll(".text-small-white");
    let textSmallBlue = svgTauxId.selectAll(".text-small-blue");
    let circlesWhite = svgTauxId.selectAll("circle.circle-white");
    let circlesBlue = svgTauxId.selectAll("circle.circle-blue");

    // sélectionner les polylines (traits du graphs)
    let polylineLineWhite = svgTauxId.select(".line-white");
    let polylineLineBlue = svgTauxId.select(".line-blue");

    // rendre tous les éléments invisibles avant de les afficher
    rendreInvisible(textSmallWhite);
    rendreInvisible(textSmallBlue);
    rendreInvisible(circlesWhite);
    rendreInvisible(circlesBlue);
    rendreInvisible([polylineLineWhite, polylineLineBlue]); 

    // Configuration du bouton
    let btnStat = document.getElementById("btnStat");
    btnStat.addEventListener("click", function() {
        // rendre invisibles les polylines avant de les animer
        rendreInvisible([polylineLineWhite, polylineLineBlue]);
        animationDoneGraph2 = false; // reinitialiser l'état de l'animation à false

        // rendre visibles tous les éléments avant d'animer les polylines
        showElements(textSmallWhite);
        showElements(textSmallBlue);
        showElements(circlesWhite);
        showElements(circlesBlue);

        // Animer les polylines (trait des graphs)
        animatePolylines(polylineLineWhite, polylineLineBlue);
    });
}

window.addEventListener("load", chargerSvg2);
