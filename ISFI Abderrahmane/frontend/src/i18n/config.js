import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      clients: 'Clients',
      projects: 'Projects',
      tasks: 'Tasks',
      timeTracking: 'Time Tracking',
      invoices: 'Invoices',
      notes: 'Notes',
      settings: 'Settings',
      logout: 'Logout',
      
      // Common
      welcome: 'Welcome back! Here\'s your overview.',
      search: 'Search...',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      amount: 'Amount',
      total: 'Total',
      
      // Dashboard
      totalClients: 'Total Clients',
      activeProjects: 'Active Projects',
      hoursThisWeek: 'Hours This Week',
      unbilledAmount: 'Unbilled Amount',
      quickActions: 'Quick Actions',
      newClient: 'New Client',
      newProject: 'New Project',
      newInvoice: 'New Invoice',
      trackTime: 'Track Time',
      revenueOverview: 'Revenue Overview',
      timeByProject: 'Time by Project',
      
      // Clients
      clientList: 'Client List',
      addClient: 'Add Client',
      clientName: 'Client Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      
      // Projects
      projectList: 'Project List',
      addProject: 'Add Project',
      projectName: 'Project Name',
      client: 'Client',
      deadline: 'Deadline',
      budget: 'Budget',
      progress: 'Progress',
      
      // Invoices
      invoiceList: 'Invoice List',
      createInvoice: 'Create Invoice',
      invoiceNumber: 'Invoice Number',
      dueDate: 'Due Date',
      paid: 'Paid',
      unpaid: 'Unpaid',
      overdue: 'Overdue',
      
      // Tasks
      taskList: 'Task List',
      addTask: 'Add Task',
      taskName: 'Task Name',
      description: 'Description',
      priority: 'Priority',
      assignedTo: 'Assigned To',
      
      // Time Tracking
      timeTracking: 'Time Tracking',
      addTimeEntry: 'Add Time Entry',
      duration: 'Duration',
      hours: 'Hours',
      
      // Notes
      notesList: 'Notes List',
      addNote: 'Add Note',
      title: 'Title',
      content: 'Content',
      
      // Page descriptions
      manageClientRelationships: 'Manage your client relationships',
      manageClientProjects: 'Manage your client projects',
      manageYourTasks: 'Manage your tasks and to-dos',
      trackYourTime: 'Track time spent on projects',
      manageInvoices: 'Manage your invoices and payments',
      organizeYourNotes: 'Organize your thoughts and ideas',
      
      // Timer & Time Tracking
      noActiveTimer: 'No active timer',
      startTimer: 'Start Timer',
      stopTimer: 'Stop Timer',
      project: 'Project',
      selectProject: 'Select a project',
      selectOption: 'Select an option',
      descriptionOptional: 'Description (optional)',
      whatAreYouWorkingOn: 'What are you working on?',
      thisWeek: 'This Week',
      averagePerDay: 'Average/Day',
      filterByProject: 'Filter by Project',
      timeEntries: 'Time Entries',
      noTimeEntriesYet: 'No time entries yet',
      startTrackingTime: 'Start tracking time or add a manual entry to see your records here.',
      
      // Filters
      allStatuses: 'All Statuses',
      allClients: 'All Clients',
      allProjects: 'All Projects',
      clearFilters: 'Clear Filters',
      
      // Empty states
      noProjectsYet: 'No projects yet',
      getStartedFirstProject: 'Get started by creating your first project.',
      createFirstProject: 'Create Your First Project',
      getStartedFirstClient: 'Get started by adding your first client.',
      addFirstClient: 'Add Your First Client',
      noTasksYet: 'No tasks yet',
      getStartedFirstTask: 'Get started by creating your first task.',
      createFirstTask: 'Create Your First Task',
      noInvoicesYet: 'No invoices yet',
      getStartedFirstInvoice: 'Create your first invoice to start billing clients.',
      createFirstInvoice: 'Create Your First Invoice',
      noTimeEntriesYet: 'No time entries yet',
      getStartedFirstEntry: 'Get started by tracking your first time entry.',
      addFirstEntry: 'Add Your First Entry',
      noNotesYet: 'No notes yet',
      getStartedFirstNote: 'Get started by creating your first note.',
      createFirstNote: 'Create Your First Note',
      
      // Status
      noClientsYet: 'No clients yet',
      noActiveProjects: '0 total projects',
      noInvoicesPending: '0 invoices pending',
      noData: 'No data',
      
      // Recent Activity
      recentActivity: 'Recent Activity',
      timeTracked: 'Time tracked',
      invoiceCreated: 'Invoice created',
      timeTrackedDesc: '{{duration}}h on {{project}}',
      invoiceCreatedDesc: 'Invoice #{{number}} for ${{amount}}',
      unknownProject: 'Unknown project',
      justNow: 'Just now',
      hoursAgo: '{{count}}h ago',
      yesterday: 'Yesterday',
      daysAgo: '{{count}} days ago',
      noRecentActivity: 'No recent activity',
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
      clients: 'Clients',
      projects: 'Projets',
      tasks: 'Tâches',
      timeTracking: 'Suivi du temps',
      invoices: 'Factures',
      notes: 'Notes',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      
      // Common
      welcome: 'Bon retour! Voici votre aperçu.',
      search: 'Rechercher...',
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      actions: 'Actions',
      status: 'Statut',
      date: 'Date',
      amount: 'Montant',
      total: 'Total',
      
      // Dashboard
      totalClients: 'Total des clients',
      activeProjects: 'Projets actifs',
      hoursThisWeek: 'Heures cette semaine',
      unbilledAmount: 'Montant non facturé',
      quickActions: 'Actions rapides',
      newClient: 'Nouveau client',
      newProject: 'Nouveau projet',
      newInvoice: 'Nouvelle facture',
      trackTime: 'Suivre le temps',
      revenueOverview: 'Aperçu des revenus',
      timeByProject: 'Temps par projet',
      
      // Clients
      clientList: 'Liste des clients',
      addClient: 'Ajouter un client',
      clientName: 'Nom du client',
      email: 'E-mail',
      phone: 'Téléphone',
      company: 'Entreprise',
      
      // Projects
      projectList: 'Liste des projets',
      addProject: 'Ajouter un projet',
      projectName: 'Nom du projet',
      client: 'Client',
      deadline: 'Date limite',
      budget: 'Budget',
      progress: 'Progression',
      
      // Invoices
      invoiceList: 'Liste des factures',
      createInvoice: 'Créer une facture',
      invoiceNumber: 'Numéro de facture',
      dueDate: 'Date d\'échéance',
      paid: 'Payé',
      unpaid: 'Non payé',
      overdue: 'En retard',
      
      // Tasks
      taskList: 'Liste des tâches',
      addTask: 'Ajouter une tâche',
      taskName: 'Nom de la tâche',
      description: 'Description',
      priority: 'Priorité',
      assignedTo: 'Assigné à',
      
      // Time Tracking
      timeTracking: 'Suivi du temps',
      addTimeEntry: 'Ajouter une entrée',
      duration: 'Durée',
      hours: 'Heures',
      
      // Notes
      notesList: 'Liste des notes',
      addNote: 'Ajouter une note',
      title: 'Titre',
      content: 'Contenu',
      
      // Page descriptions
      manageClientRelationships: 'Gérez vos relations clients',
      manageClientProjects: 'Gérez vos projets clients',
      manageYourTasks: 'Gérez vos tâches et vos choses à faire',
      trackYourTime: 'Suivez le temps passé sur les projets',
      manageInvoices: 'Gérez vos factures et paiements',
      organizeYourNotes: 'Organisez vos pensées et idées',
      
      // Timer & Time Tracking
      noActiveTimer: 'Aucun minuteur actif',
      startTimer: 'Démarrer le minuteur',
      stopTimer: 'Arrêter le minuteur',
      project: 'Projet',
      selectProject: 'Sélectionner un projet',
      selectOption: 'Sélectionner une option',
      descriptionOptional: 'Description (optionnel)',
      whatAreYouWorkingOn: 'Sur quoi travaillez-vous?',
      thisWeek: 'Cette semaine',
      averagePerDay: 'Moyenne/Jour',
      filterByProject: 'Filtrer par projet',
      timeEntries: 'Entrées de temps',
      noTimeEntriesYet: 'Pas encore d\'entrées de temps',
      startTrackingTime: 'Commencez à suivre le temps ou ajoutez une entrée manuelle pour voir vos enregistrements ici.',
      
      // Filters
      allStatuses: 'Tous les statuts',
      allClients: 'Tous les clients',
      allProjects: 'Tous les projets',
      clearFilters: 'Effacer les filtres',
      
      // Empty states
      noProjectsYet: 'Pas encore de projets',
      getStartedFirstProject: 'Commencez par créer votre premier projet.',
      createFirstProject: 'Créer votre premier projet',
      getStartedFirstClient: 'Commencez par ajouter votre premier client.',
      addFirstClient: 'Ajouter votre premier client',
      noTasksYet: 'Pas encore de tâches',
      getStartedFirstTask: 'Commencez par créer votre première tâche.',
      createFirstTask: 'Créer votre première tâche',
      noInvoicesYet: 'Pas encore de factures',
      getStartedFirstInvoice: 'Créez votre première facture pour commencer à facturer les clients.',
      createFirstInvoice: 'Créer votre première facture',
      noTimeEntriesYet: 'Pas encore d\'entrées de temps',
      getStartedFirstEntry: 'Commencez par suivre votre première entrée de temps.',
      addFirstEntry: 'Ajouter votre première entrée',
      noNotesYet: 'Pas encore de notes',
      getStartedFirstNote: 'Commencez par créer votre première note.',
      createFirstNote: 'Créer votre première note',
      
      // Status
      noClientsYet: 'Pas encore de clients',
      noActiveProjects: '0 projets au total',
      noInvoicesPending: '0 factures en attente',
      noData: 'Aucune donnée',
      
      // Recent Activity
      recentActivity: 'Activité récente',
      timeTracked: 'Temps suivi',
      invoiceCreated: 'Facture créée',
      timeTrackedDesc: '{{duration}}h sur {{project}}',
      invoiceCreatedDesc: 'Facture #{{number}} pour ${{amount}}',
      unknownProject: 'Projet inconnu',
      justNow: 'À l\'instant',
      hoursAgo: 'Il y a {{count}}h',
      yesterday: 'Hier',
      daysAgo: 'Il y a {{count}} jours',
      noRecentActivity: 'Aucune activité récente',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

