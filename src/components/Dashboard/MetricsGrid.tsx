import React from 'react';
import { Calendar, Users, Target, Award } from 'lucide-react';
import { MetricsCard } from './MetricsCard';

interface MetricsGridProps {
  stats: {
    totalEvents: number;
    totalTechnicians: number;
    eventCompletionRate: string;
    assignmentAcceptanceRate: string;
  };
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats }) => {
  const metrics = [
    {
      title: 'Événements',
      value: stats.totalEvents,
      subtitle: 'Total créés',
      icon: Calendar,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-50',
      trend: 'up' as const,
      trendValue: '+12%',
      trendColor: 'text-green-600',
    },
    {
      title: 'Techniciens',
      value: stats.totalTechnicians,
      subtitle: 'Équipe active',
      icon: Users,
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-50',
      trend: 'up' as const,
      trendValue: '+5%',
      trendColor: 'text-green-600',
    },
    {
      title: 'Réussite',
      value: `${stats.eventCompletionRate}%`,
      subtitle: 'Événements terminés',
      icon: Target,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50',
      trend: 'up' as const,
      trendValue: '+8%',
      trendColor: 'text-green-600',
    },
    {
      title: 'Acceptation',
      value: `${stats.assignmentAcceptanceRate}%`,
      subtitle: 'Taux d\'acceptation',
      icon: Award,
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-50',
      trend: 'down' as const,
      trendValue: '-2%',
      trendColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <MetricsCard key={index} {...metric} />
      ))}
    </div>
  );
}; 