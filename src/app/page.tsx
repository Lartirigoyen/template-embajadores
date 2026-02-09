'use client';

import { Avatar, Navbar } from '~/ui/components';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-lycsa-verde-50 to-lycsa-beige-50">
      {/* Navbar */}
      <Navbar>
        <Avatar 
          src='/logo.png' 
          name="Template Embajadores" 
          description="LYCSA Suite" 
          positionName="right" 
        />
        <Avatar 
          name="Usuario Demo" 
          description="Embajador" 
          positionName="left" 
        />
      </Navbar>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-5xl font-aller-bold text-lycsa-verde-700 mb-4">
            Bienvenido Embajador
          </h1>
          <p className="text-xl text-gray-600 font-aller-light">
            Template listo para comenzar tu proyecto
          </p>
        </div>
      </div>
    </main>
  );
}
