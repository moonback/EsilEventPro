import React from 'react';
import { MetricsCard } from './MetricsCard';
import { Calendar, Users, TrendingUp, Award } from 'lucide-react';

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
      title: 'Événements totaux',
      value: stats.totalEvents,
      icon: Calendar,
      iconColor: '#3b82f6',
      iconBgColor: '#dbeafe',
      trend: 'up' as const,
      trendValue: '+12%',
      trendColor: '#16a34a',
      subtitle: 'Ce mois',
    },
    {
      title: 'Techniciens',
      value: stats.totalTechnicians,
      icon: Users,
      iconColor: '#8b5cf6',
      iconBgColor: '#ede9fe',
      trend: 'neutral' as const,
      trendValue: '0%',
      trendColor: '#64748b',
      subtitle: 'Actifs',
    },
    {
      title: 'Taux de complétion',
      value: stats.eventCompletionRate,
      icon: TrendingUp,
      iconColor: '#f59e0b',
      iconBgColor: '#fef3c7',
      trend: 'up' as const,
      trendValue: '+5%',
      trendColor: '#16a34a',
      subtitle: 'Ce mois',
    },
    {
      title: 'Taux d\'acceptation',
      value: stats.assignmentAcceptanceRate,
      icon: Award,
      iconColor: '#10b981',
      iconBgColor: '#d1fae5',
      trend: 'up' as const,
      trendValue: '+8%',
      trendColor: '#16a34a',
      subtitle: 'Ce mois',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricsCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          iconColor={metric.iconColor}
          iconBgColor={metric.iconBgColor}
          trend={metric.trend}
          trendValue={metric.trendValue}
          trendColor={metric.trendColor}
          subtitle={metric.subtitle}
          onClick={() => console.log(`Clicked on ${metric.title}`)}
        />
      ))}
    </div>
  );
}; 