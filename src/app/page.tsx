'use client';

import { useState } from 'react';
import { api } from './_trpc/Provider';
import { Button, Card, Badge, Loader, Modal, useToast, Avatar, Navbar } from '~/ui/components';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const healthQuery = api.system.health.useQuery();
  const dbStatusQuery = api.system.dbStatus.useQuery();

  const handleTestToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: '¡Operación exitosa!',
      error: 'Ha ocurrido un error',
      warning: 'Advertencia: revisa los datos',
      info: 'Información importante',
    };
    addToast(messages[type], type);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-lycsa-verde-50 to-lycsa-beige-50">
      {/* Header */}
      <Navbar>
        <Avatar name="Template Embajadores" description="LYCSA Suite" positionName="right" />
        <Avatar name="Usuario Demo" description="Desarrollador" positionName="left" />
      </Navbar>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status Card */}
          <Card title="Estado del Sistema">
            {healthQuery.isLoading ? (
              <Loader size="sm" text="Verificando..." />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-aller">Estado:</span>
                  <Badge variant="success">
                    {healthQuery.data?.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-aller">Timestamp:</span>
                  <span className="font-aller-light text-sm text-gray-600">
                    {healthQuery.data?.timestamp &&
                      new Date(healthQuery.data.timestamp).toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Database Card */}
          <Card title="Base de Datos">
            {dbStatusQuery.isLoading ? (
              <Loader size="sm" text="Verificando conexiones..." />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-aller">DB Principal:</span>
                  <Badge
                    variant={
                      dbStatusQuery.data?.primary === 'connected' ? 'success' : 'error'
                    }
                  >
                    {dbStatusQuery.data?.primary}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-aller">DB Secundaria:</span>
                  <Badge
                    variant={
                      dbStatusQuery.data?.secondary === 'connected'
                        ? 'success'
                        : dbStatusQuery.data?.secondary === 'not_configured'
                        ? 'secondary'
                        : 'error'
                    }
                  >
                    {dbStatusQuery.data?.secondary}
                  </Badge>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Features Card */}
        <Card
          title="Características del Template"
          subtitle="Todo lo que incluye este template"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: '⚡ Next.js 15', desc: 'App Router + React Server Components' },
              { title: '🔥 tRPC', desc: 'Type-safe API sin código duplicado' },
              { title: '🗄️ Drizzle ORM', desc: 'ORM TypeScript con PostgreSQL' },
              { title: '☁️ AWS S3', desc: 'Integración lista con S3/MinIO' },
              { title: '📊 ExcelJS', desc: 'Import/Export Excel sin esfuerzo' },
              { title: '🎨 Tailwind CSS', desc: 'Design System Lycsa Suite' },
              { title: '✅ Zod', desc: 'Validación de schemas y env' },
              { title: '🐳 Docker', desc: 'Dockerfile multi-stage listo' },
              { title: '🔒 TypeScript', desc: 'Full type-safety en todo el stack' },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lycsa border border-gray-200 hover:shadow-lycsa transition-shadow"
              >
                <h3 className="font-aller-bold text-lycsa-verde-700 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm font-aller-light text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <Card title="Componentes de UI">
          <div className="flex flex-wrap gap-3">
            <Button label='Toast Success' onClick={() => handleTestToast('success')} />
            <Button label='Toast Error' variant='contained' color="error" onClick={() => handleTestToast('error')} />
            <Button label='Toast Warning' variant="outline" color='warning' onClick={() => handleTestToast('warning')} />
            <Button label='Toast Info' variant="text" color='info' onClick={() => handleTestToast('info')} />
            <Button label='Abrir Modal' variant='contained' color="secondary" onClick={() => setIsModalOpen(true)} />
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Template generado para <span className="font-aller-bold text-lycsa-verde-600">Lycsa Suite</span>
          </p>
          <p className="text-sm text-gray-500 mt-1 font-aller-light">
            Listo para desarrollo de aplicaciones fullstack
          </p>
        </div>
      </div>

      {/* Modal de ejemplo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal de Ejemplo"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" label='Cancelar' onClick={() => setIsModalOpen(false)} />
            <Button label="Aceptar" onClick={() => setIsModalOpen(false)} />
          </div>
        }
      >
        <p className="text-gray-700">
          Este es un modal de ejemplo del Design System de Lycsa Suite.
        </p>
        <p className="text-gray-600 mt-3 text-sm">
          Todos los componentes están listos para usar en tu aplicación.
        </p>
      </Modal>
    </main>
  );
}
