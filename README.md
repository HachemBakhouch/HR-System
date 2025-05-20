HR System
Vue d'ensemble
Le système RH   est une application web complète de gestion des ressources humaines conçue pour les chaînes de boutiques retail. Cette solution centralisée permet de gérer efficacement les employés, le pointage, les congés, les tâches et les évaluations à travers plusieurs niveaux hiérarchiques (administrateur, responsable de secteur, responsable de boutique et employé).

Fonctionnalités principales

Gestion des employés : Profils, informations personnelles, historique
Gestion des tâches : Création, assignation et suivi des tâches
Pointage et présence : Système de pointage, suivi des retards et absences
Gestion des congés : Demande, approbation et suivi des congés
Calendrier partagé : Vue des événements et plannings
Évaluations : Système d'évaluation des performances
Tableaux de bord : Statistiques et KPIs pour tous les niveaux hiérarchiques
Interface responsive : Adaptée à tous les appareils

Structure des rôles
Le système comprend 4 niveaux d'accès :

Administrateur (admin) : Accès complet au système, gestion des paramètres
Responsable de secteur (sector) : Gestion d'un groupe de boutiques dans une zone géographique
Responsable de boutique (store) : Gestion d'une boutique spécifique
Employé (employee) : Accès limité à son profil et ses tâches

Architecture technique
Structure des dossiers
mazzaro-hr-system/
│
├── assets/
│   ├── css/             # Feuilles de style
│   ├── js/              # Scripts JavaScript
│   ├── img/             # Images et ressources graphiques
│   └── fonts/           # Polices de caractères
│
├── auth/                # Pages d'authentification
│
├── admin/               # Interface administrateur
│
├── sector/              # Interface responsable secteur
│
├── store/               # Interface responsable boutique
│
├── employee/            # Interface employé
│
├── components/          # Composants réutilisables
│
└── index.html           # Page de redirection vers login
Technologies utilisées

HTML5/CSS3 : Structure et style des pages
JavaScript : Interactions côté client
Chart.js : Visualisation de données
Font Awesome : Icônes
Google Fonts : Typographie (Poppins et Montserrat)

Installation et déploiement
Prérequis

Serveur web (Apache, Nginx, etc.)
Connaissances en HTML, CSS et JavaScript

Instructions d'installation

Cloner le dépôt :
git clone https://github.com/yourusername/mazzaro-hr-system.git

Déployer les fichiers sur votre serveur web
Accéder à l'application via l'URL de votre serveur web

Configuration
Le système inclut des comptes de démonstration pour tester les différents rôles :

Admin : admin / admin123
Secteur : secteur / secteur123
Boutique : boutique / boutique123
Employé : employe / employe123

Guide des pages principales
Pages d'authentification

login.html : Page de connexion
forgot-password.html : Récupération de mot de passe
reset-password.html : Réinitialisation de mot de passe

Tableaux de bord

admin/index.html : Vue d'ensemble pour les administrateurs
sector/index.html : Vue d'ensemble pour les responsables secteur
store/index.html : Vue d'ensemble pour les responsables boutique
employee/index.html : Vue d'ensemble pour les employés

Gestion des employés

admin/employees.html : Gestion complète des employés
sector/employees.html : Employés par secteur
store/employees.html : Employés par boutique

Gestion des tâches et tickets

admin/tickets.html : Gestion globale des tâches
sector/tickets.html : Tâches par secteur
store/tickets.html : Tâches par boutique
employee/tickets.html : Tâches assignées à un employé

Présence et congés

admin/attendance.html : Suivi global des présences
employee/attendance.html : Pointage individuel
admin/leave.html : Gestion des congés
employee/leave.html : Demandes de congés

Personnalisation et extension
Modification des styles
Les styles principaux sont définis dans les fichiers CSS :

main.css : Styles de base et variables
dashboard.css : Styles pour les tableaux de bord
components.css : Styles des composants réutilisables
login.css : Styles des pages d'authentification

Les variables CSS définies dans :root dans le fichier main.css permettent de modifier facilement les couleurs et autres éléments visuels.
Ajout de nouvelles fonctionnalités
Pour ajouter de nouvelles fonctionnalités :

Créer les nouveaux fichiers HTML dans le dossier approprié
Ajouter les liens dans les menus de navigation (sidebar.html)
Utiliser les composants existants pour maintenir la cohérence visuelle
Mettre à jour les scripts JavaScript si nécessaire

Informations développeurs
Composants réutilisables
Le dossier components/ contient des éléments réutilisables :

sidebar.html : Barre latérale de navigation
header.html : En-tête avec notifications et profil
footer.html : Pied de page commun
employee-card.html : Carte employé
ticket-card.html : Carte tâche/ticket
modals.html : Fenêtres modales

Scripts JavaScript

main.js : Fonctions globales et initialisation
auth.js : Authentification et gestion des sessions
dashboard.js : Fonctionnalités du tableau de bord
tickets.js : Gestion des tâches et tickets
attendance.js : Pointage et suivi de présence
leave.js : Gestion des congés
calendar.js : Fonctionnalités du calendrier
employees.js : Gestion des employés
charts.js : Initialisation et configuration des graphiques
