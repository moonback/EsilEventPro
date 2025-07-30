import React from 'react';
import { Calendar, Users, Target, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
      icon: Calendar,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: 'up' as const,
      trendValue: '+12%',
      trendColor: 'text-green-500',
    },
    {
      title: 'Techniciens',
      value: stats.totalTechnicians,
      icon: Users,
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-100',
      trend: 'up' as const,
      trendValue: '+5%',
      trendColor: 'text-green-500',
    },
    {
      title: 'Taux de réussite',
      value: `${stats.eventCompletionRate}%`,
      icon: Target,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      trend: 'up' as const,
      trendValue: '+8%',
      trendColor: 'text-green-500',
    },
    {
      title: 'Acceptation',
      value: `${stats.assignmentAcceptanceRate}%`,
      icon: Award,
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-100',
      trend: 'down' as const,
      trendValue: '-2%',
      trendColor: 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <MetricsCard key={index} {...metric} />
      ))}
    </div>
  );
}; 