# Tripmate

Bienvenue dans **Tripmate** – votre compagnon de voyage ultime ! Tripmate est une application mobile développée avec React Native pour le frontend et Flask pour le backend. Cette application vous permet de créer et de planifier vos voyages en découvrant des endroits à visiter, en obtenant des informations utiles sur les lieux de destination, et bien plus encore.

## Fonctionnalités

- **Planification de voyages** : Créez et planifiez vos voyages en sélectionnant des destinations et en ajoutant des lieux d'intérêt à votre itinéraire.
- **Découverte de lieux** : Découvrez les endroits à visiter dans votre destination avec des informations clés, des conseils locaux et des recommandations.
- **Profil personnel** : Gardez une trace des lieux que vous avez visités, et affichez fièrement vos badges de voyage en fonction du nombre de pays visités.
- **Badges de voyage** : Gagnez des badges spéciaux lorsque vous atteignez des étapes importantes, comme le nombre de pays visités.

## Technologies Utilisées

### Frontend

- **React Native** : Pour le développement de l'interface utilisateur mobile multiplateforme.

### Backend

- **Flask** : Pour gérer les requêtes API et les fonctionnalités backend.

### Conteneurisation

- **Docker** : Pour faciliter le déploiement et le développement de l'application dans un environnement isolé.

## Installation

### Prérequis

- Docker
- Docker Compose (facultatif, mais recommandé)

### Étapes d'installation avec Docker

1. **Clonez le dépôt :**

    ```bash
    git clone https://github.com/votre-utilisateur/tripmate.git
    cd tripmate
    ```

2. **Mettez à jour la configuration du frontend :**

   Avant de démarrer l'application, vous devez modifier l'IP dans le fichier de configuration `frontend/config/config.json`. Remplacez `YOUR_IP_HERE` par votre propre adresse IP.

3. **Créez un fichier `.env` dans le dossier frontend :**

   Dans le dossier `frontend`, créez un fichier `.env` contenant les informations suivantes :

    ```bash
    DATABASE_URL=mysql+pymysql://root:root@db/tripmate
    JWT_SECRET_KEY=tripmate_jwt_token
    ```

4. **Créez le dossier versions pour les migrations du backend :**

   Dans le dossier `backend/migrations`, créez un dossier appelé `versions` :

    ```bash
    mkdir backend/migrations/versions
    ```

5. **Construisez et lancez les conteneurs :**

   Utilisez Docker Compose pour construire et lancer les conteneurs du frontend et backend :

    ```bash
    docker-compose up --build
    ```

   Cette commande va télécharger les images nécessaires, construire les conteneurs et lancer l'application.

6. **Démarrez Expo pour le frontend :**

   Une fois les conteneurs lancés, ouvrez un autre terminal et exécutez la commande suivante pour démarrer Expo :

    ```bash
    npx expo start
    ```

7. **Installez Expo Go sur votre téléphone :**

   Pour tester l'application sur un appareil réel, installez Expo Go depuis l'App Store (iOS) ou Google Play (Android). Scannez ensuite le QR code généré par la commande `npx expo start` pour lancer l'application sur votre téléphone.

### Accédez à l'application :

- **Frontend** : L'application React Native sera disponible via Expo sur votre appareil ou émulateur.
- **Backend** : L'API Flask sera accessible à l'adresse [http://localhost:5000](http://localhost:5000).

### Développement avec Docker

Pour continuer à développer l'application, assurez-vous que vos modifications sont répercutées à l'intérieur des conteneurs Docker. Docker Compose surveille les fichiers et applique les changements automatiquement.

1. **Développez l'application** :

   Modifiez les fichiers sources dans les répertoires `frontend` et `backend`.

2. **Reconstruisez les conteneurs si nécessaire :**

   Si vous ajoutez de nouvelles dépendances ou effectuez des changements dans les Dockerfiles, reconstruisez les conteneurs avec :

    ```bash
    docker-compose up --build
    ```

3. **Arrêtez les conteneurs :**

   Pour arrêter l'application, utilisez la commande :

    ```bash
    docker-compose down
    ```

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes suivantes :

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b ma-nouvelle-fonctionnalité`).
3. Commitez vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Pushez votre branche (`git push origin ma-nouvelle-fonctionnalité`).
5. Ouvrez une Pull Request.

## Auteurs

- Emeric Legendre - [https://github.com/EmericLegendre](https://github.com/EmericLegendre)
- Camille Kershero - [https://github.com/Camserho](https://github.com/Camserho)
- Nathan Cahaigne - [https://github.com/nathanCahgn](https://github.com/nathanCahgn)
- Mehdi Sabir - [https://github.com/mehdaaa](https://github.com/mehdaaa)
- Matteo Cogan - [https://github.com/MatteoCogan](https://github.com/MatteoCogan)
- Téophile Chardon - [https://github.com/KawaiiTenshi555](https://github.com/KawaiiTenshi555)

## Remerciements

Merci à toutes les personnes qui ont contribué à l'élaboration de Tripmate.  
Remerciements particuliers aux communautés de React Native, Flask, et Docker pour leurs documentations et outils de qualité.
