
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: React.ReactNode;
}

const StatsCard = ({ title, value, icon, description, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-app-blue">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && <div className="ml-auto">{trend}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
