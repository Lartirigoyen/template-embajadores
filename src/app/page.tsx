'use client';

import { useState } from 'react';
import { api } from './_trpc/Provider';
import { Button, Card, Badge, Loader, Modal, useToast } from '~/ui/components';
import { useAppSelector, selectUser } from '~/app/store';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();
  const user = useAppSelector(selectUser);

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
    <main className="min-h-screen bg-gradient-to-br from-lycsa-verde-50 to-lycsa-beige-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y nombre */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lycsa-verde-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-aller-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-lg font-aller-bold text-gray-900">Template Embajadores</h1>
                <p className="text-xs text-gray-500 font-aller-light">Lycsa Suite</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-aller-bold text-gray-900">
                  {user?.firstName ? user.firstName + ' ' + user.lastName : 'Usuario' }
                </p>
                <p className="text-xs text-gray-500 font-aller-light">
                  {user?.username || 'Sin usuario'}
                </p>
              </div>
              <div className="w-10 h-10 bg-lycsa-verde-100 rounded-full flex items-center justify-center">
                <span className="text-lycsa-verde-700 font-aller-bold text-sm">
                  {user?.firstName ? user.firstName[0] + (user.lastName?.[0] || '') : 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status Card */}
          <Card title="Estado del Sistema" padding="lg">
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
          <Card title="Base de Datos" padding="lg">
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
                        ? 'default'
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
          padding="lg"
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
        <Card title="Componentes de UI" padding="lg" className="mt-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleTestToast('success')}>Toast Success</Button>
            <Button variant="secondary" onClick={() => handleTestToast('error')}>
              Toast Error
            </Button>
            <Button variant="outline" onClick={() => handleTestToast('warning')}>
              Toast Warning
            </Button>
            <Button variant="ghost" onClick={() => handleTestToast('info')}>
              Toast Info
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Abrir Modal
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 font-aller-light">
            Template generado para <span className="font-aller-bold text-lycsa-verde-600">Lycsa Suite</span>
          </p>
          <p className="text-sm text-gray-500 font-aller-light mt-1">
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Aceptar</Button>
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
