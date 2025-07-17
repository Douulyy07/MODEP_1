import { useState, useEffect } from 'react';
import { adherentsAPI, soinsAPI, cotisationsAPI } from '../services/api';

export const useRecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      // Récupérer les données récentes
      const [adherentsRes, soinsRes, cotisationsRes] = await Promise.all([
        adherentsAPI.getAll(),
        soinsAPI.getAll(),
        cotisationsAPI.getAll()
      ]);

      const adherents = adherentsRes.data;
      const soins = soinsRes.data;
      const cotisations = cotisationsRes.data;

      // Créer les activités basées sur les données réelles
      const recentActivities = [];

      // Activités des adhérents récents
      adherents.slice(0, 3).forEach(adherent => {
        recentActivities.push({
          id: `adherent-${adherent.id}`,
          type: 'adherent',
          icon: 'bi-person-plus',
          color: '#10b981',
          bgColor: '#d1fae5',
          title: 'Nouvel adhérent enregistré',
          description: `${adherent.prenom} ${adherent.nom} a été ajouté au système`,
          time: getRelativeTime(adherent.date_recrutement || new Date()),
          data: adherent
        });
      });

      // Activités des soins récents
      soins.slice(0, 3).forEach(soin => {
        recentActivities.push({
          id: `soin-${soin.id}`,
          type: 'soin',
          icon: 'bi-heart-pulse',
          color: '#f59e0b',
          bgColor: '#fef3c7',
          title: 'Nouveau dossier de soin',
          description: `Dossier #${soin.num_recu} créé pour ${soin.adherent?.prenom} ${soin.adherent?.nom}`,
          time: getRelativeTime(soin.date_soin),
          data: soin
        });
      });

      // Activités des cotisations récentes
      cotisations.slice(0, 2).forEach(cotisation => {
        recentActivities.push({
          id: `cotisation-${cotisation.id}`,
          type: 'cotisation',
          icon: 'bi-credit-card',
          color: '#3b82f6',
          bgColor: '#dbeafe',
          title: 'Cotisation mise à jour',
          description: `Statut de cotisation modifié pour ${cotisation.prenom} ${cotisation.nom}`,
          time: getRelativeTime(cotisation.date_debut || new Date()),
          data: cotisation
        });
      });

      // Trier par date et prendre les 6 plus récentes
      const sortedActivities = recentActivities
        .sort((a, b) => new Date(b.data.date_recrutement || b.data.date_soin || b.data.date_debut || new Date()) - 
                       new Date(a.data.date_recrutement || a.data.date_soin || a.data.date_debut || new Date()))
        .slice(0, 6);

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Il y a moins d\'une heure';
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const addActivity = (activity) => {
    setActivities(prev => [activity, ...prev.slice(0, 5)]);
  };

  return { activities, loading, fetchRecentActivity, addActivity };
};