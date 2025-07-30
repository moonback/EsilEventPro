# Guide d'import iCal

## Vue d'ensemble

La fonctionnalité d'import iCal permet d'importer automatiquement des événements depuis des fichiers iCal (.ics) exportés depuis Google Calendar, Outlook, ou d'autres calendriers.

## Comment utiliser l'import iCal

### 1. Accéder à la fonctionnalité

1. Connectez-vous à l'application en tant qu'administrateur
2. Naviguez vers la page "Gestion des événements"
3. Cliquez sur le bouton "Importer iCal" dans la barre d'actions

### 2. Préparer votre fichier iCal

#### Depuis Google Calendar :
1. Ouvrez Google Calendar
2. Sélectionnez le calendrier que vous souhaitez exporter
3. Cliquez sur les trois points à côté du nom du calendrier
4. Sélectionnez "Paramètres et partage"
5. Faites défiler jusqu'à "Intégrer le calendrier"
6. Cliquez sur "Exporter" pour télécharger le fichier .ics

#### Depuis Outlook :
1. Ouvrez Outlook
2. Allez dans "Fichier" > "Ouvrir et exporter" > "Importer/Exporter"
3. Sélectionnez "Exporter vers un fichier"
4. Choisissez "Format de fichier de données personnelles (.pst)"
5. Sélectionnez le calendrier à exporter
6. Choisissez un emplacement et cliquez sur "Terminer"

### 3. Importer les événements

1. Cliquez sur "Sélectionner un fichier" dans le modal d'import
2. Choisissez votre fichier .ics
3. Le système analysera automatiquement le fichier et affichera tous les événements trouvés
4. Sélectionnez le type d'événement par défaut pour tous les événements importés
5. Cochez les événements que vous souhaitez importer
6. Cliquez sur "Importer X événement(s)"

## Fonctionnalités

### Validation automatique
- Les événements sont automatiquement validés avant l'import
- Les événements avec des erreurs (dates invalides, titre manquant, etc.) sont marqués en rouge
- Seuls les événements valides peuvent être sélectionnés pour l'import

### Prévisualisation
- Tous les événements du fichier sont affichés avec leurs détails
- Vous pouvez voir le titre, la description, la localisation, et les dates
- Les événements sont marqués comme valides (✓) ou invalides (⚠)

### Sélection flexible
- Sélectionnez/désélectionnez des événements individuellement
- Utilisez "Tout sélectionner" pour sélectionner tous les événements valides
- Utilisez "Tout désélectionner" pour désélectionner tous les événements

### Gestion des erreurs
- Les événements avec des erreurs sont clairement identifiés
- Les messages d'erreur expliquent pourquoi un événement ne peut pas être importé
- Le système continue l'import même si certains événements échouent

## Formats supportés

- **Fichiers .ics** : Format standard iCalendar
- **Fichiers .ical** : Variante du format iCalendar
- **Calendriers Google** : Exportés depuis Google Calendar
- **Calendriers Outlook** : Exportés depuis Microsoft Outlook
- **Autres calendriers** : Tout calendrier compatible avec le format iCalendar

## Informations importées

Pour chaque événement, les informations suivantes sont importées :

- **Titre** : Le nom de l'événement (obligatoire)
- **Description** : La description de l'événement (optionnel)
- **Localisation** : Le lieu de l'événement (optionnel)
- **Date de début** : Date et heure de début (obligatoire)
- **Date de fin** : Date et heure de fin (obligatoire)
- **Type d'événement** : Défini par l'utilisateur lors de l'import

## Limitations

- Les événements dans le passé ne peuvent pas être importés
- Les événements sans titre ne peuvent pas être importés
- Les événements avec une date de fin antérieure à la date de début ne peuvent pas être importés
- Les exigences en techniciens ne sont pas importées (à configurer manuellement après l'import)

## Dépannage

### Problème : "Erreur lors du parsing du fichier"
- Vérifiez que le fichier est bien au format .ics ou .ical
- Assurez-vous que le fichier n'est pas corrompu
- Essayez de réexporter le fichier depuis votre calendrier

### Problème : "Aucun événement trouvé"
- Vérifiez que le fichier contient bien des événements
- Assurez-vous que les événements ont des dates valides
- Vérifiez que les événements ne sont pas dans le passé

### Problème : "Erreur lors de l'import"
- Vérifiez votre connexion internet
- Assurez-vous d'être connecté en tant qu'administrateur
- Vérifiez que vous avez les permissions nécessaires

## Conseils

1. **Testez d'abord** : Importez un petit nombre d'événements pour tester
2. **Vérifiez les dates** : Assurez-vous que les événements ont des dates valides
3. **Configurez les types** : Définissez le bon type d'événement avant l'import
4. **Vérifiez après l'import** : Consultez les événements importés pour vous assurer qu'ils sont corrects
5. **Configurez les exigences** : Ajoutez les exigences en techniciens après l'import si nécessaire 