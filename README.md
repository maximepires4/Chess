# TP noté - CHESS - HTML&CSS&JS

| Binôme  |             Valeurs             |
| ------------- |:-------------------------------:|
| N°     |               37                |
| Membres      | Giulia Passanisi & Maxime Pires |

**Github :** https://github.com/Marouk4/Web-dynamique-Chess

**Dernière question traitée :** Question bonus sur les déplacements

----

## Choix techniques

----

### Plateau de jeu

#### Structure HTML
Le plateau de jeu se trouve dans la balise :  
`<article class="plateau"></article>`  
Cette balise est remplie automatiquement par le fichier javascript de div avec une ID et la classe case, ainsi que la case correspondant à la pièce.

De part et d'autre du plateau il y a le nom du joueur avec son score, ainsi que les pièces qu'il a capturées qui sont automatiquement affichée lors d'une capture.

Il y a enfin deux boutons pour réinitialiser le jeu ou la grille.
#### Style CSS
Nous avons utilisé le display en flexbox avec la pseudo-class nth-child.

La plupart des éléments HTML on leur propre style qui est définit dans ce fichier.
#### Pièces
Nous avons utilisé l'attribut `background-image`, en ajoutant l'url correspondant pour chaque pièce.
Ensuite dans la classe case nous avons spécifié le comportement de l'image de fond (nous l'avons mis dans case pour éviter de le répéter dans chaque classe de pièce) :
- `background-repeat: no-repeat;` pour que l'image n'apparaisse qu'une seule fois.
- `background-position: center;` pour positionner l'image au centre
- `background-size: 80%;` pour faire coller l'image à la taille de la case
----

### Moteur du jeu

#### Tour par tour
La fonction `changePlayer` est appelée après qu'un joueur ait sélectionné une pièce, puis qu'il ait sélectionné une case d'arrivée valide.
Cette fonction n'est pas appelée si le déplacement à engendré une victoire.
#### Initialisation et réinitialisation du plateau
La fonction `initBoard` récupère l'élément contenant le plateau et y insère 64 nouveaux div.
Ensuite la fonction `initGame` s'occupe d'initialisé toutes les variables du programme, y compris les scores, et initialise chaque case en y ajoutant la classe `case` et celle correspondant à une pièce si cette case en accueille une.
Cette dernière fonction est appelée par les deux boutons de réinitialisation, un booléen permet de différencier si l'on veut réinitialiser tout le jeu ou seulement la grille.
#### Gestion des pièces
La sélection est enregistrée dans le premier `if` de la fonction `play` en ajoutant la class de sélection.
La sélection n'est opérée que si le joueur choisie une classe contenant une pièce lui appartenant, et qu'il n'a pas de sélection en cours.
Si les conditions sont réunis nous affichons aussi des points représentant les mouvements possibles de la pièce grâce à la fonction `showMovement`
La case sélectionnée est enregistrée dans les variables.

Une fois une pièce sélectionnée, des points apparaissent représentant les mouvements possible et le déplacement n'aura lieu que si le joueur clique sur une case contenant un de ces points.
Si le joueur se trompe dans sa sélection de déplacement, la sélection est supprimée et il pourra recommencer.
C'est aussi à cet endroit que nous ajoutons au joueur la pièce qu'il vient de capturer si tel est le cas.
Il y a aussi la condition de victoire et l'incrémentation du score ou le changement de joueur.
#### Condition de victoire
Le booléen `gameFinished` est actualisé grâce à la fonction `checkForWin` à chaque déplacement.
Si ce booléen est vrai les joueurs ne peuvent plus sélectionner de case, il faut réinitialiser la grille ou le jeu.
La fonction `checkForWin` vérifie que le roi adverse est encore là, elle vérifie aussi si le joueur adverse à encore au moins une pièce.
Si cette dernière fonction met à jour le booléen sur `true`, on gère la fin de la partie (voir partie suivante).
#### Gestion du score
Lorsque victoire il y a, un incrémente un entier présent dans un tableau de score, puis on affiche les entier de ce tableau sur la page HTML.
Il y a un bouton permettant de réinitialiser seulement la grille, et un pour réinitialiser le score aussi.