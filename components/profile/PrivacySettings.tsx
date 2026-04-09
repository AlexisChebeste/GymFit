import { useState } from "react";
import { Card } from "../cards/Card";

export default function PrivacySettings() {

  const [settings, setSettings] = useState({
    publicProfile: true,
    searchIndexing: false,
    anonymousInsights: true,
    partnerIntegrations: false,
    weeklyDigest: true,
    communityEvents: false,
    personalRecords: true
  });

  function toggle(key: keyof typeof settings) {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  return (
    <div className="flex flex-col gap-6 w-full">

      <div>
        <p className="text-sm uppercase tracking-widest text-secondary font-bold">
          Privacidad
        </p>
        <h2 className="text-2xl font-bold">Configuración de privacidad</h2>
        <p className="text-sm text-muted-foreground">
          Controla cómo se comparten tus datos y actividad.
        </p>
      </div>

      {/* Profile visibility */}
      <Card className="p-6 flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Visibilidad del perfil</h3>

        <Toggle
          label="Perfil público"
          description="Otros usuarios pueden ver tu perfil y actividad."
          value={settings.publicProfile}
          onChange={() => toggle("publicProfile")}
        />

        <Toggle
          label="Indexación en buscadores"
          description="Permite que tu perfil aparezca en Google."
          value={settings.searchIndexing}
          onChange={() => toggle("searchIndexing")}
        />
      </Card>

      {/* Data sharing */}
      <Card className="p-6 flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Datos y analíticas</h3>

        <Toggle
          label="Insights anónimos"
          description="Usar tus datos para mejorar recomendaciones."
          value={settings.anonymousInsights}
          onChange={() => toggle("anonymousInsights")}
        />

        <Toggle
          label="Integraciones externas"
          description="Permitir conexión con apps como Strava."
          value={settings.partnerIntegrations}
          onChange={() => toggle("partnerIntegrations")}
        />
      </Card>

      {/* Notifications */}
      <Card className="p-6 flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Notificaciones</h3>

        <Toggle
          label="Resumen semanal"
          description="Recibe un reporte de tu progreso."
          value={settings.weeklyDigest}
          onChange={() => toggle("weeklyDigest")}
        />

        <Toggle
          label="Eventos de la comunidad"
          description="Notificaciones de desafíos y eventos."
          value={settings.communityEvents}
          onChange={() => toggle("communityEvents")}
        />

        <Toggle
          label="Récords personales"
          description="Avisos cuando superas una marca."
          value={settings.personalRecords}
          onChange={() => toggle("personalRecords")}
        />
      </Card>

      {/* Danger zone */}
      <Card className="p-6 border-red-500/30 bg-red-500/5 flex flex-col gap-3">
        <h3 className="font-semibold text-red-500">Eliminar cuenta</h3>
        <p className="text-sm text-muted-foreground">
          Esta acción eliminará permanentemente tu cuenta y todos tus datos.
        </p>

        <button className="self-start text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500/10 transition cursor-pointer">
          Eliminar cuenta
        </button>
      </Card>

      {/* save */}
      <div className="flex justify-end">
        <button className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold text-black cursor-pointer">
          Guardar preferencias
        </button>
      </div>

    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex justify-between items-center">

      <div className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {description}
        </span>
      </div>

      <button
        onClick={onChange}
        className={`w-11 h-6 flex items-center rounded-full transition cursor-pointer ${
          value ? "bg-primary justify-end" : "bg-zinc-500"
        }`}
      >
        <div className="w-5 h-5 bg-white rounded-full m-0.5" />
      </button>

    </div>
  );
}