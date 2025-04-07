
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Database, BarChart, FileText, Users, MapPin, Upload, Download, HelpCircle, GitBranch, Globe, Server } from 'lucide-react';

const QuickLink = ({ 
  icon, 
  title, 
  path, 
  isNew = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  path: string; 
  isNew?: boolean;
}) => (
  <Link to={path}>
    <Card className="hover:bg-blue-50 transition-colors relative overflow-hidden">
      {isNew && (
        <div className="absolute -right-8 top-2 bg-yellow-500 text-xs text-white font-bold py-1 px-8 rotate-45">
          NEW
        </div>
      )}
      <CardContent className="p-6 flex flex-col items-center justify-center text-center h-40">
        <div className="text-app-blue mb-4">{icon}</div>
        <div>{title}</div>
      </CardContent>
    </Card>
  </Link>
);

const QuickLinksSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <QuickLink 
        icon={<Database size={40} />} 
        title="Voir le tableau de bord des sites" 
        path="/sites" 
      />
      <QuickLink 
        icon={<GitBranch size={40} />} 
        title="Créer ou gérer des workflows" 
        path="/workflow" 
        isNew 
      />
      <QuickLink 
        icon={<Globe size={40} />} 
        title="Gérer les intégrations" 
        path="/integrations" 
        isNew
      />
      <QuickLink 
        icon={<Server size={40} />} 
        title="Sources de données" 
        path="/data-sources" 
        isNew
      />
      <QuickLink 
        icon={<MapPin size={40} />} 
        title="Voir propriétés des sites" 
        path="/sites" 
      />
      <QuickLink 
        icon={<FileText size={40} />} 
        title="Créer ou voir données mensuelles" 
        path="/actual-data" 
      />
      <QuickLink 
        icon={<Upload size={40} />} 
        title="Importer données" 
        path="/import" 
      />
      <QuickLink 
        icon={<Download size={40} />} 
        title="Exporter données" 
        path="/export" 
      />
    </div>
  );
};

export default QuickLinksSection;
