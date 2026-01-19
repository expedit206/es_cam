# Guide de Test - Gestion du Blog Admin

## Prérequis

- Serveur Laravel en cours d'exécution : `php api/artisan serve`
- Serveur Vue.js en cours d'exécution : `npx vite --port=4000`
- Un compte admin créé dans la base de données

## Tests à effectuer

### 1. Vérifier l'accès admin

1. **Se connecter en tant qu'admin**

   - Aller sur `/login`
   - Se connecter avec un compte admin
   - Vérifier que le lien "Administration" apparaît dans la sidebar

2. **Accéder au dashboard admin**
   - Cliquer sur "Administration" ou aller sur `/admin/dashboard`
   - Vérifier que le bouton "Gérer le Blog" est présent

### 2. Tester la gestion du blog

#### A. Accéder à la page de gestion

- Cliquer sur "Gérer le Blog" depuis le dashboard
- OU aller directement sur `/admin/blog`
- **Résultat attendu** : Page avec 3 cartes de statistiques et un tableau vide (si aucun post)

#### B. Créer un nouvel article

1. Cliquer sur "Nouvel Article"
2. Remplir le formulaire :
   - **Titre** : "Mon premier article de test"
   - **Extrait** : "Ceci est un extrait de test"
   - **Contenu** : "Ceci est le contenu complet de mon article de test..."
   - **Image** : Sélectionner une image (optionnel)
   - **Publier immédiatement** : Cocher ou non
3. Cliquer sur "Enregistrer"
4. **Résultat attendu** :
   - Message "Article enregistré avec succès !"
   - L'article apparaît dans le tableau
   - Les statistiques sont mises à jour

#### C. Modifier un article

1. Cliquer sur l'icône "Modifier" (crayon) d'un article
2. Modifier le titre ou le contenu
3. Cliquer sur "Enregistrer"
4. **Résultat attendu** :
   - Message de succès
   - Les modifications sont visibles dans le tableau

#### D. Publier/Dépublier un article

1. Cliquer sur l'icône œil d'un article en brouillon
2. **Résultat attendu** :

   - Le statut passe à "Publié"
   - Le badge devient vert
   - Les statistiques sont mises à jour

3. Cliquer à nouveau sur l'icône (œil barré)
4. **Résultat attendu** :
   - Le statut passe à "Brouillon"
   - Le badge devient orange

#### E. Supprimer un article

1. Cliquer sur l'icône poubelle d'un article
2. Confirmer la suppression
3. **Résultat attendu** :
   - Message "Article supprimé avec succès"
   - L'article disparaît du tableau
   - Les statistiques sont mises à jour

### 3. Tester la vue publique

#### A. Liste des articles

1. Se déconnecter ou ouvrir une fenêtre de navigation privée
2. Aller sur `/blog`
3. **Résultat attendu** :
   - Seuls les articles publiés sont visibles
   - Les brouillons ne sont PAS visibles
   - Affichage en grille avec images, titres, extraits

#### B. Détail d'un article

1. Cliquer sur un article
2. **Résultat attendu** :
   - Affichage du contenu complet
   - Informations de l'auteur
   - Compteur de vues incrémenté

### 4. Tests de sécurité

#### A. Protection des routes admin

1. Se déconnecter
2. Essayer d'accéder à `/admin/blog`
3. **Résultat attendu** : Redirection vers `/login`

#### B. Vérifier les permissions

1. Se connecter avec un compte utilisateur normal (non-admin)
2. Essayer d'accéder à `/admin/blog`
3. **Résultat attendu** : Redirection vers `/market-place` ou erreur 403

### 5. Tests de validation

#### A. Champs requis

1. Essayer de créer un article sans titre
2. **Résultat attendu** : Message d'erreur "Ce champ est requis"

3. Essayer de créer un article sans contenu
4. **Résultat attendu** : Message d'erreur

#### B. Upload d'image

1. Essayer d'uploader un fichier non-image (PDF, TXT, etc.)
2. **Résultat attendu** : Erreur de validation

3. Essayer d'uploader une image trop grande (> 5MB)
4. **Résultat attendu** : Erreur de validation

### 6. Tests de pagination

1. Créer plus de 20 articles
2. **Résultat attendu** :
   - Boutons de pagination apparaissent
   - Navigation entre les pages fonctionne
   - Compteur "Page X / Y" correct

### 7. Tests responsive

#### A. Mobile

1. Ouvrir sur un appareil mobile ou réduire la fenêtre
2. **Résultat attendu** :
   - Le tableau s'adapte
   - Les boutons restent accessibles
   - Le modal s'affiche correctement

#### B. Tablet

1. Tester sur une tablette ou en mode tablette
2. **Résultat attendu** : Interface adaptée

## Checklist de vérification

- [ ] Connexion admin fonctionne
- [ ] Accès à `/admin/blog` fonctionne
- [ ] Création d'article fonctionne
- [ ] Modification d'article fonctionne
- [ ] Suppression d'article fonctionne
- [ ] Toggle publication fonctionne
- [ ] Upload d'image fonctionne
- [ ] Statistiques se mettent à jour
- [ ] Vue publique affiche uniquement les articles publiés
- [ ] Compteur de vues fonctionne
- [ ] Pagination fonctionne
- [ ] Protection des routes fonctionne
- [ ] Validation des formulaires fonctionne
- [ ] Interface responsive fonctionne

## Problèmes connus et solutions

### Problème : "Erreur 401 Unauthorized"

**Solution** : Vérifier que vous êtes bien connecté en tant qu'admin

### Problème : "Erreur 403 Forbidden"

**Solution** : Vérifier que votre compte a bien le rôle 'admin'

### Problème : Images ne s'affichent pas

**Solution** :

1. Vérifier que le dossier `api/public/storage/blog/` existe
2. Vérifier les permissions du dossier
3. Vérifier le chemin dans la base de données

### Problème : "CORS Error"

**Solution** : Vérifier la configuration CORS dans `api/config/cors.php`

## Commandes utiles

### Créer un admin via Tinker

```bash
php api/artisan tinker
```

```php
$user = App\Models\User::find('ID_DE_VOTRE_USER');
$user->role = 'admin';
$user->save();
```

### Vider le cache

```bash
php api/artisan cache:clear
php api/artisan config:clear
php api/artisan route:clear
```

### Voir les routes

```bash
php api/artisan route:list | grep blog
```

## Résultat attendu final

✅ Interface admin complète et fonctionnelle
✅ CRUD complet sur les articles
✅ Gestion des images
✅ Statistiques en temps réel
✅ Vue publique sécurisée
✅ Interface moderne et responsive
