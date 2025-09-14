# Plan de Développement - Client Assist62 (Tauri + React)

Ce document décrit les étapes prévues pour le développement de l'application client Assist62.

## Phase 1: Fondations et Authentification

-   [x] **1.1. Configuration de l'environnement :**
    -   [x] Mettre en place un store global (Zustand ou Redux Toolkit) pour gérer l'état de l'application (token JWT, informations utilisateur).
    -   [x] Définir les types TypeScript pour les modèles de données de l'API (`User`, `Category`, `Problem`, etc.).
    -   [x] Configurer un client HTTP (ex: `axios` ou le client natif de Tauri) pour communiquer avec l'API REST. Intercepteur pour ajouter le token JWT aux requêtes.

-   [x] **1.2. Page de Connexion :**
    -   [x] Créer un formulaire de connexion (nom d'utilisateur, mot de passe).
    -   [x] Implémenter la logique d'appel à `POST /api/auth/login`.
    -   [x] Stocker le token JWT de manière sécurisée (Tauri secure storage ou store d'état).
    -   [x] Mettre en place une redirection vers la page d'accueil après une connexion réussie.
    -   [x] Gérer les erreurs de connexion.

-   [x] **1.3. Routage :**
    -   [x] Installer et configurer un routeur pour React (ex: `react-router-dom`).
    -   [x] Créer des routes protégées qui nécessitent une authentification.
    -   [x] Créer une route publique pour la page de connexion.

## Phase 2: Fonctionnalités de base pour l'Utilisateur

-   [x] **2.1. Page d'accueil (Dashboard) :**
    -   [x] Afficher les actualités récentes (`GET /api/news/all`).
    -   [x] Afficher les catégories racines (`GET /api/category/root`) pour démarrer la navigation.
    -   [x] Afficher les favoris de l'utilisateur (`GET /api/user/{userId}/favorites`).

-   [x] **2.2. Navigation dans les Catégories :**
    -   [x] Créer un composant pour afficher une catégorie et ses enfants (`GET /api/category/{id}/children`).
    -   [x] Permettre une navigation hiérarchique (style "breadcrumb" ou vue en arborescence).
    -   [x] Afficher la liste des problèmes pour une catégorie sélectionnée (`GET /api/problem/category/{categoryId}`).

-   [x] **2.3. Arbre de Décision (Résolution de Problème) :**
    -   [x] Créer une vue pour afficher un problème et sa description (`GET /api/problem/{id}`).
    -   [x] Afficher la première étape de décision (`DecisionStep`).
    -   [x] Créer des composants pour les différents types de choix (`NavigationChoice`, `UrlChoice`, `FinalChoice`).
    -   [x] Implémenter la logique de navigation entre les étapes en fonction des choix de l'utilisateur.
    -   [x] Gérer l'affichage des images (`imageUrl`) et des conclusions.

-   [x] **2.4. Actualités et Notifications :**
    -   [x] Créer une page dédiée pour lister toutes les actualités (`GET /api/news/all`) avec un système de filtre/recherche.
    -   [x] Créer un composant (ex: une cloche dans la barre de navigation) pour afficher les notifications de l'utilisateur (`GET /api/user/{userId}/notifications`).
    -   [x] Implémenter la fonctionnalité pour marquer une notification comme lue (`POST /notifications/{notificationId}/read`).

-   [x] **2.5. Gestion du Profil Utilisateur :**
    -   [x] Créer une page de profil pour l'utilisateur.
    -   [x] Gérer les abonnements aux catégories (`GET`, `POST`, `DELETE /api/user/{userId}/subscriptions/{categoryId}`).
    -   [x] Gérer les catégories favorites (`GET`, `POST`, `DELETE /api/user/{userId}/favorites/{categoryId}`).

## Phase 3: Fonctionnalités pour Administrateurs et Modérateurs

-   [x] **3.1. Panneau d'Administration :**
    -   [x] Créer une section "Admin" accessible uniquement aux rôles `ADMIN` et `MODO`.
    -   [x] Mettre en place des gardes de route basées sur les rôles.

-   [ ] **3.2. Gestion des Contenus :**
    -   [x] **Catégories :** Créer des formulaires pour ajouter, modifier et supprimer des catégories.
    -   [x] **Problèmes :** Créer une interface pour créer et éditer des problèmes.
    -   [ ] **Arbres de décision :** Créer un éditeur (potentiellement visuel ou basé sur des formulaires) pour construire et modifier les `DecisionStep` et les `Choice`.
    -   [ ] **Actualités :** Créer un éditeur de texte riche pour rédiger et gérer les actualités.
    -   [ ] **Images :** Créer une interface pour téléverser et gérer les images (`POST /api/images/upload`).

-   [ ] **3.3. Gestion des Utilisateurs (pour `ADMIN`) :**
    -   [ ] Créer une vue pour lister, créer, modifier et supprimer des utilisateurs (`/api/user`).

## Phase 4: Améliorations et Finitions

-   [ ] **4.1. Recherche :**
    -   [ ] Implémenter une barre de recherche globale pour trouver des problèmes par titre (`GET /api/problem/title/{title}`).

-   [ ] **4.2. UI/UX :**
    -   [ ] Améliorer le style général de l'application (CSS, framework UI comme Material-UI ou Ant Design).
    -   [ ] Assurer une expérience utilisateur fluide et responsive.
    -   [ ] Ajouter des indicateurs de chargement et une gestion des erreurs plus robuste.

-   [ ] **4.3. Intégration Tauri :**
    -   [ ] Utiliser les notifications système de Tauri pour les nouvelles alertes importantes.
    -   [ ] Optimiser l'utilisation des fonctionnalités natives (stockage, etc.).
