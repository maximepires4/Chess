let currentPlayer = 0;
let scorePlayers = [0, 0];

let gameFinished = false;

const arrayPlayersPieces = [["pion-blanc", "tour-blanc", "cavalier-blanc", "fou-blanc", "roi-blanc", "reine-blanc"], ["pion-noir", "tour-noir", "cavalier-noir", "fou-noir", "roi-noir", "reine-noir"]];

/**
 * Variables liées à la sélection
 */
let currentSelection = false;
let selectedHTML;
let selectedHTMLClasses;

/**
 * Récupère la deuxième classe déclaré dans votre liste.
 * Découpe votre ensemble de classe selon les espaces pour les mettre dans un tableau (split).
 * @param {*} selectedClasses
 * @returns la classe liée à une pièce si elle exise sinon renvoie vide.
 */
function getCaseClass(selectedClasses) {
    /**
     * On récupère l'ensemble des classes sous forme de tableau, et on récupère la deuxième.
     * Note : Toujours déclarer votre class liée à une pièce en deuxième.
     */
    if (selectedClasses !== "") {
        const arraySplitedClasses = selectedClasses.split(" ");
        if (arraySplitedClasses.length > 1) {
            return arraySplitedClasses[1];
        } else {
            return "";
        }
    }
}

/**
 * Passe au joueur suivant.
 */
function changePlayer() {
    currentPlayer = (currentPlayer + 1) % 2;
}

/**
 * Ajoute une classe selon le joueur courant à une liste de classe liée à un élément HTML.
 * @param {*} classList liste des classes d'un élément HTML.
 */
function addSelectedClassByPlayer(classList) {
    classList.add("selected" + (currentPlayer === 0 ? "Red" : "Blue"));
}

/**
 * Retire une classe selon le joueur courant d'une liste de classe liée à un élément HTML.
 * @param {*} classList liste des classes d'un élément HTML.
 */
function removeSelectedClassByPlayer(classList) {
    classList.remove("selected" + (currentPlayer === 0 ? "Red" : "Blue"));
}

/**
 * Convertit la case d'une pièce en son code HTML
 * @param caseClass Classe de la pièce
 * @returns {string} Code HTML de la pièce
 */
function getPieceString(caseClass) {
    switch (caseClass) {
        case "pion-blanc":
            return "&#9817;";
        case "pion-noir":
            return "&#9823;";
        case "tour-blanc":
            return "&#9814;";
        case "tour-noir":
            return "&#9820;";
        case "fou-blanc":
            return "&#9815;";
        case "fou-noir":
            return "&#9821;";
        case "cavalier-blanc":
            return "&#9816;";
        case "cavalier-noir":
            return "&#9822;";
        case "reine-blanc":
            return "&#9813;";
        case "reine-noir":
            return "&#9819;";
        case "roi-blanc":
            return "&#9812;";
        case "roi-noir":
            return "&#9818;";
    }
    return "";
}

/**
 * Fonction liée à l'évènement 'click'.
 */
var play = function () {

    // Le jeu est figé s'il est terminé
    if (!gameFinished) {

        // S'il n'y a pas de sélection
        // Et que la case choisie n'est pas vide
        // Et que la case contient une pièce appartenant au joueur courant
        if (!currentSelection && !isCaseEmpty(this) && isCaseAllowed(this)) {

            // Enregistrement de la sélection dans différentes variables
            currentSelection = true;
            selectedHTML = this;
            selectedHTMLClasses = this.className;

            // Affichage des mouvements possibles de la pièce
            showMovement(this);

            // Ajout de la classe de sélection à la case pour la mettre en surbrillance
            addSelectedClassByPlayer(this.classList);

        }
        // Sinon si il y a une sélection actuelle
        else if (currentSelection) {

            // On regarde si la case d'atterrissage contient des sous éléments,
            // car dans ce programme les seuls sous éléments que peuvent contenir les cases sont des "points" permettant de montrer quels sont les mouvements possibles d'une pièce
            // Cette condition permet donc de vérifier si le joueur clique bien sur une case autorisée à accueillir la pièce
            if (this.children.length !== 0) {

                // Si la case d'arrivée contient une pièce (qui sera nécessairement une pièce adverse grâce aux algorithmes déterminant le mouvement des pièces)
                if (getCaseClass(this.className) !== "") {

                    // Ajout de cette pièce dans les pièces prises par le joueur actuel
                    document.getElementById("piecesTaken" + currentPlayer).innerHTML += getPieceString(getCaseClass(this.className));
                }

                // Mise à jour de la case d'arrivée (ajout de la pièce se déplaçant)
                this.className = selectedHTMLClasses;

                // Mise à jour de la case de départ (suppression de la pièce se déplaçant)
                selectedHTML.className = "case";

                // Vérification si la partie est terminée
                gameFinished = checkForWin();

                // Si la partie est terminée, on incrémente le score du joueur actuel
                // Sinon on change de joueur
                if (gameFinished) {
                    scorePlayers[currentPlayer]++;
                    printScore();
                } else {
                    changePlayer();
                }
            }

            // Dans tous les cas, on supprime la sélection (si le joueur a cliqué sur une mauvaise case il devra recommencer)
            removeSelection();
        }
    }
};

/**
 * Appel de deux fonctions permettant d'initialiser le jeu
 */
initBoard();
initGame(true);
/**
 * On lie tous les éléments avec la classe 'case' à l'événement 'click'.
 */
var elements = document.getElementsByClassName("case");
for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', play, false);
}

/**
 * Initialise le plateau
 */
function initBoard() {

    // Récupération du plateau
    const plateau = getBoard();

    // Pour chaque case, création d'un div
    for (let i = 0; i < 64; i++) {
        plateau.appendChild(document.createElement('div'));
    }
}

/**
 * Retourne le plateau de jeu contenant toutes les cases
 */
function getBoard() {
    return document.getElementsByClassName("plateau").item(0);
}

/**
 * Initialise toutes les variables du jeu
 * @param resetGame Booléen permettant de savoir si on réinitialise tout ou seulement la grille
 */
function initGame(resetGame) {
    // On réinitialise toutes les variables de jeu
    currentPlayer = 0;
    gameFinished = false;
    currentSelection = false;
    selectedHTML = null;
    selectedHTMLClasses = null;

    // Si on cherche à recommencer le jeu entièrement, on reset le score
    if (resetGame) {
        scorePlayers = [0, 0];
        printScore();
    }

    // Réinitialise les pièces prises par l'utilisateur
    initPiecesTaken();

    // Replacement des pièces
    initPieces();
}

/**
 * Met à jour le score sur la page HTML
 */
function printScore() {

    // Mise à jour des scores
    document.getElementById("whiteScore").innerHTML = scorePlayers[0].toString();
    document.getElementById("blackScore").innerHTML = scorePlayers[1].toString();
}

/**
 * Réinitialise les pièces prises par un utilisateur
 */
function initPiecesTaken() {
    // Réinitialisation des pièces prises
    document.getElementById("piecesTaken0").innerHTML = "&nbsp;";
    document.getElementById("piecesTaken1").innerHTML = "&nbsp;";
}

/**
 * Place les pièces au bon endroit
 */
function initPieces() {

    // Récupération des cases via les enfants du plateau
    const cases = getElementsChildren(getBoard());

    // Boucle sur toutes les cases
    for (let i = 0; i < cases.length; i++) {

        // Ajout d'un id utile pour le calcul des coups possible d'une pièce
        cases[i].id = i;

        // Ajout de la classe case
        cases[i].className = "case";

        // Supprime tout les sous éléments des cases
        // Donc supprime tout les "points" montrant les mouvements d'une pièce dans le cas ou on réinitialise le jeu pendant qu'ils sont affichés
        let children = getElementsChildren(cases[i]);
        if (children.length !== 0) {
            cases[i].removeChild(children[0]);
        }

        // Placement des pièces au bon endroit
        switch (i) {
            case 0:
            case 7:
                cases[i].classList.add("tour-noir");
                break;
            case 1:
            case 6:
                cases[i].classList.add("cavalier-noir");
                break;
            case 2:
            case 5:
                cases[i].classList.add("fou-noir");
                break;
            case 3:
                cases[i].classList.add("reine-noir");
                break;
            case 4:
                cases[i].classList.add("roi-noir");
                break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                cases[i].classList.add("pion-noir");
                break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
                cases[i].classList.add("pion-blanc");
                break;
            case 56:
            case 63:
                cases[i].classList.add("tour-blanc");
                break;
            case 57:
            case 62:
                cases[i].classList.add("cavalier-blanc");
                break;
            case 58:
            case 61:
                cases[i].classList.add("fou-blanc");
                break;
            case 59:
                cases[i].classList.add("reine-blanc");
                break;
            case 60:
                cases[i].classList.add("roi-blanc");
                break;
        }
    }
}

/**
 * Renvoi les sous éléments d'un élément
 */
function getElementsChildren(element) {
    return element.children;
}

/**
 * Retourne vrai si l'élément ne contient pas de pièce, faux sinon
 */
function isCaseEmpty(element) {
    return getCaseClass(element.className) === "";
}

/**
 * Retourne vrai si l'élément contient une pièce du joueur actuel
 */
function isCaseAllowed(target) {
    return arrayPlayersPieces[currentPlayer].includes(getCaseClass(target.className));
}

/**
 * Retourne vrai si l'élément contient une pièce du joueur ennemi
 */
function isCaseEnnemy(target) {
    if (target === null) {
        return false;
    } else {
        return arrayPlayersPieces[(currentPlayer + 1) % 2].includes(getCaseClass(target.className));
    }
}

/**
 * Retourne vrai si la partie est gagnée
 */
function checkForWin() {

    // Vérification de la présence des rois
    if (document.getElementsByClassName("roi-" + (currentPlayer === 0 ? "noir" : "blanc")).length === 0) {
        return true;
    }

    // Le reste vérifie si le joueur ennemi a encore des pièces, en réalité ne sert à rien avec l'algorithme précédent (nous le laissons car il était demandé)
    let win = false;
    let arrayOtherPlayerPieces = arrayPlayersPieces[(currentPlayer + 1) % 2];

    for (let i = 0; i < arrayOtherPlayerPieces.length; i++) {
        win = document.getElementsByClassName(arrayOtherPlayerPieces[i]).length === 0;
        if (!win) return win;
    }

    return win;
}

/**
 * Supprime la sélection d'un joueur
 */
function removeSelection() {
    // Enlève la classe permettant d'highlight la case
    removeSelectedClassByPlayer(selectedHTML.classList);

    // Réinitialise la variable de sélection
    currentSelection = false;

    // L'algorithme suivant supprime tout les premiers sous éléments de chaques cases
    // Ces sous éléments seront tout le temps les "points" montrant le déplacement
    const cases = getElementsChildren(getBoard());
    for (let i = 0; i < cases.length; i++) {
        if (getElementsChildren(cases[i]).length !== 0) {
            cases[i].removeChild(getElementsChildren(cases[i]).item(0));
        }
    }
}

/**
 * Première strate permettant d'afficher le déplacement d'une pièce
 * Cette fonction calcule de quelle pièce il s'agit et redirige vers la bonne fonction
 * @param element Élément contenant une pièce
 */
function showMovement(element) {
    const piece = getCaseClass(selectedHTMLClasses);

    switch (piece) {
        case "pion-blanc":
            showMovementPion(element, true);
            break;
        case "pion-noir":
            showMovementPion(element, false);
            break;
        case "tour-blanc":
        case "tour-noir":
            showMovementTour(element);
            break;
        case "fou-blanc":
        case "fou-noir":
            showMovementFou(element);
            break;
        case "cavalier-blanc":
        case "cavalier-noir":
            showMovementCavalier(element);
            break;
        case "reine-blanc":
        case "reine-noir":
            showMovementTour(element);
            showMovementFou(element);
            break;
        case "roi-blanc":
        case "roi-noir":
            showMovementRoi(element);
            break;

    }
}

/**
 * Fonctions permettant de calculer et d'afficher les coups de chaques pièces
 */

/**
 * Calcule les cases de mouvement d'un pion
 * @param element Élément contenant le pion
 * @param white Booléen pour savoir si la pièce est blanche ou noir
 */
function showMovementPion(element, white) {
    // Cette constante permettra de regarder soit les cases d'au-dessus soit d'en dessous
    const colorConst = white ? -1 : 1;

    // On vérifie que la case devant le pion ne contient pas une pièce ennemie
    if (!isCaseEnnemy(document.getElementById((parseInt(element.id) + 8 * colorConst).toString()))) {

        // Si oui on essaye d'appliquer un point de mouvement
        tryPutSelectionDot(parseInt(element.id) + 8 * colorConst);

        // On répète l'opération pour la case d'encore après mais seulement dans le cas où les pions sont sur leur première rangée
        if (!isCaseEnnemy(document.getElementById((parseInt(element.id) + 16 * colorConst).toString()))) {
            if ((white && element.id <= 55 && element.id >= 48) || (!white && element.id <= 15 && element.id >= 8)) {
                tryPutSelectionDot(parseInt(element.id) + 16 * colorConst);
            }
        }
    }

    // On regarde à gauche pour voir si on peut manger un ennemi
    if (element.id % 8 !== 7 && isCaseEnnemy(document.getElementById((parseInt(element.id) + 7 * colorConst).toString()))) {
        tryPutSelectionDot(parseInt(element.id) + 7 * colorConst);
    }

    // On regarde à droite pour voir si on peut manger un ennemi
    if (element.id % 8 !== 0 && isCaseEnnemy(document.getElementById((parseInt(element.id) + 9 * colorConst).toString()))) {
        tryPutSelectionDot(parseInt(element.id) + 9 * colorConst);
    }
}

/**
 * Calcule les cases de mouvement d'une tour
 * @param element Élément contenant la tour
 */
function showMovementTour(element) {

    // Cases vers le bas
    let i = 1;
    while (tryPutSelectionDot(parseInt(element.id) + 8 * i)) { // Tant qu'on arrive à poser un point de mouvement sur la case suivante

        i++; // Incrémentation d'une variable pour viser la case d'après

        // Si la case d'après est hors du tableau on sort de la boucle
        if (parseInt(element.id) + 8 * i > 63) {
            break;
        }
    }

    // Cases vers le haut
    // Cette algorithme est le même qu'au-dessus avec un moins en guise différence pour regarder les cases vers le haut
    i = 1;
    while (tryPutSelectionDot(parseInt(element.id) - 8 * i)) {
        i++;

        if (parseInt(element.id) - 8 * i < 0) {
            break
        }
    }

    // Cases vers la gauche
    if (element.id % 8 !== 0) { // Si la pièce est collée à gauche on ne rentre pas dans l'algorithme
        i = 1;
        while (tryPutSelectionDot(parseInt(element.id) - i)) {
            i++;

            // La troncature de la case divisée par 8 donne exactement la ligne sur laquelle est la case
            // On vérifie que les deux lignes sont similaires
            if (Math.trunc((parseInt(element.id) - i) / 8) !== Math.trunc(element.id / 8)) {
                break;
            }
        }
    }

    // Cases vers la droite
    // Cet algorithme ressemble à celui au-dessus
    if (element.id % 8 !== 7) {
        i = 1;
        while (tryPutSelectionDot(parseInt(element.id) + i)) {
            i++;

            if (Math.trunc((parseInt(element.id) + i) / 8) !== Math.trunc(element.id / 8)) {
                break;
            }
        }
    }
}

/**
 * Calcule les mouvements du cavalier
 */
function showMovementCavalier(element) {

    if (element.id % 8 !== 7) {
        // Bas droite
        tryPutSelectionDot(parseInt(element.id) + 16 + 1);

        // Haut droite
        tryPutSelectionDot(parseInt(element.id) - 16 + 1);

        if (element.id % 8 < 5) {
            // Droite bas
            tryPutSelectionDot(parseInt(element.id) + 8 + 2);

            // Droite haut
            tryPutSelectionDot(parseInt(element.id) - 8 + 2);
        }
    }

    if (element.id % 8 !== 0) {
        // Bas gauche
        tryPutSelectionDot(parseInt(element.id) + 16 - 1);

        // Haut gauche
        tryPutSelectionDot(parseInt(element.id) - 16 - 1);

        if (element.id % 8 > 2) {
            // Gauche bas
            tryPutSelectionDot(parseInt(element.id) + 8 - 2);

            // Gauche haut
            tryPutSelectionDot(parseInt(element.id) - 8 - 2);
        }
    }
}

/**
 * Calcule les mouvements du fou
 */
function showMovementFou(element) {
    let i;

    // Droite
    if (element.id % 8 !== 7) {

        // Bas droite
        i = 1;
        while (tryPutSelectionDot(parseInt(element.id) + 9 * i)) {

            // On sort de la boucle si la case n'existe plus ou que la case est la dernière à gauche
            if (parseInt(element.id) + 9 * i > 63 || (parseInt(element.id) + 9 * i) % 8 === 7) {
                break;
            }

            i++;
        }

        // Haut droite
        i = 1;
        while (tryPutSelectionDot(parseInt(element.id) - 7 * i)) {
            if (parseInt(element.id) - 7 * i > 63 || (parseInt(element.id) - 7 * i) % 8 === 7) {
                break;
            }

            i++;
        }
    }

    // Gauche
    if (element.id % 8 !== 0) {

        // Haut gauche
        i = 1;
        while (tryPutSelectionDot(parseInt(element.id) - 9 * i)) {
            if (parseInt(element.id) - 9 * i < 0 || (parseInt(element.id) - 9 * i) % 8 === 0) {
                break;
            }

            i++;
        }

        // Bas gauche
        i = 1;
        while (tryPutSelectionDot(parseInt(element.id) + 7 * i)) {
            if (parseInt(element.id) + 7 * i > 63 || (parseInt(element.id) + 7 * i) % 8 === 0) {
                break;
            }

            i++;
        }
    }
}

/**
 * Calcule les mouvements du roi
 */
function showMovementRoi(element) {

    // Bas
    tryPutSelectionDot(parseInt(element.id) + 8);

    // Haut
    tryPutSelectionDot(parseInt(element.id) - 8);

    // Gauche
    if (element.id % 8 !== 0) {
        // Centre gauche
        tryPutSelectionDot(parseInt(element.id) - 1);

        // Bas gauche
        tryPutSelectionDot(parseInt(element.id) - 1 + 8);

        // Haut gauche
        tryPutSelectionDot(parseInt(element.id) - 1 - 8);
    }

    // Droite
    if (element.id % 8 !== 7) {
        // Centre droite
        tryPutSelectionDot(parseInt(element.id) + 1);

        // Bas droite
        tryPutSelectionDot(parseInt(element.id) + 1 + 8);

        // Haut droite
        tryPutSelectionDot(parseInt(element.id) + 1 - 8);
    }
}

/**
 * Récupère une case, vérifie qu'elle existe bien et qu'elle ne contient pas une pièce alliée
 * Si ces conditions sont vérifiées, la fonction applique un point de mouvement sur la case représentant un mouvement possible pour la pièce
 * Finalement, la fonction retourne un booléen représentant s'il faut continuer à chercher des cases plus loin
 * Concrètement, si la case n'existe pas ou qu'elle contient une pièce alliée on va s'arrêter là
 * Pareillement si la case contient une pièce ennemie, à la différence près qu'on appliquera quand même un point de mouvement pour pouvoir la manger
 */
function tryPutSelectionDot(targetId) {

    // On récupère la case grâce à l'ID
    let target = document.getElementById(targetId.toString());

    // Si la case existe et qu'elle ne contient pas une pièce alliée
    if (target !== null && !isCaseAllowed(target)) {

        // Création d'un point
        const dot = document.createElement('div');

        // Si la case est ennemie, on affichera un point différent
        if (isCaseEnnemy(target)) {
            dot.className = "enemy";
            target.appendChild(dot);
            return false; // On retourne faux dans ce cas-là, car on n'ira pas voir plus loin
        } else {
            dot.className = "dot";
            target.appendChild(dot);
            return true; // On retourne vrai seulement dans ce cas ou la case n'est pas ennemie
        }
    }

    return false; // On retourne faux si la case n'existe pas ou qu'elle contient une pièce alliée
}