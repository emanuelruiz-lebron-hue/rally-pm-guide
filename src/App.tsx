import { useMemo, useRef, useState } from "react";
import { ArrowLeft, CircleDot, MousePointer2 } from "lucide-react";
import { domains } from "./domainData";
import type { Domain, DomainId, Module } from "./types";

type DragState = {
  domainId: DomainId;
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  hasMoved: boolean;
};

export function App() {
  const [activeDomainId, setActiveDomainId] = useState<DomainId | null>(null);
  const activeDomain = domains.find((domain) => domain.id === activeDomainId) ?? null;

  return (
    <main className="app-shell">
      {activeDomain ? (
        <DomainWorkspace domain={activeDomain} onBack={() => setActiveDomainId(null)} />
      ) : (
        <DomainDashboard onOpenDomain={setActiveDomainId} />
      )}
    </main>
  );
}

function DomainDashboard({ onOpenDomain }: { onOpenDomain: (id: DomainId) => void }) {
  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const suppressNextClickRef = useRef(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  const draggingDomain = domains.find((domain) => domain.id === dragState?.domainId) ?? null;

  function isInsideDropZone(clientX: number, clientY: number) {
    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (!rect) return false;

    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  function startDrag(domainId: DomainId, event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      domainId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      x: event.clientX,
      y: event.clientY,
      hasMoved: false,
    });
    setIsDropZoneActive(isInsideDropZone(event.clientX, event.clientY));
  }

  function updateDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    setDragState((current) => {
      if (!current) return current;

      const distance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
      return { ...current, x: event.clientX, y: event.clientY, hasMoved: current.hasMoved || distance > 8 };
    });
    setIsDropZoneActive(isInsideDropZone(event.clientX, event.clientY));
  }

  function endDrag(event: React.PointerEvent<HTMLButtonElement>, domainId: DomainId) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    const shouldOpen = isInsideDropZone(event.clientX, event.clientY);
    const wasDragGesture = dragState.hasMoved;
    setDragState(null);
    setIsDropZoneActive(false);

    if (wasDragGesture) {
      suppressNextClickRef.current = true;
      window.setTimeout(() => {
        suppressNextClickRef.current = false;
      }, 0);
    }

    if (wasDragGesture && shouldOpen) {
      window.setTimeout(() => onOpenDomain(domainId), 90);
    }
  }

  return (
    <section className="dashboard-view" aria-labelledby="dashboard-title">
      <div className="dashboard-copy">
        <p className="eyebrow">Personal operating spaces</p>
        <h1 id="dashboard-title">Welcome back. Choose where your attention belongs.</h1>
        <p>
          Drag a domain into the center to enter its workspace, or open one directly when
          you already know where you are headed.
        </p>
      </div>

      <DropZone refElement={dropZoneRef} isDragging={Boolean(dragState)} isActive={isDropZoneActive} />

      <div className="domain-grid" aria-label="Domain choices">
        {domains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            isDragging={dragState?.domainId === domain.id}
            onOpen={() => {
              if (suppressNextClickRef.current) return;
              onOpenDomain(domain.id);
            }}
            onPointerDown={(event) => startDrag(domain.id, event)}
            onPointerMove={updateDrag}
            onPointerUp={(event) => endDrag(event, domain.id)}
            onPointerCancel={() => {
              setDragState(null);
              setIsDropZoneActive(false);
            }}
          />
        ))}
      </div>

      {dragState && draggingDomain ? (
        <div
          className="drag-ghost"
          style={{
            "--domain-accent": draggingDomain.accent,
            "--domain-accent-soft": draggingDomain.accentSoft,
            left: dragState.x - dragState.offsetX,
            top: dragState.y - dragState.offsetY,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          {(() => {
            const GhostIcon = draggingDomain.icon;
            return <GhostIcon size={24} strokeWidth={1.8} />;
          })()}
          <span>{draggingDomain.title}</span>
        </div>
      ) : null}
    </section>
  );
}

function DomainCard({
  domain,
  isDragging,
  onOpen,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  domain: Domain;
  isDragging: boolean;
  onOpen: () => void;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: () => void;
}) {
  const Icon = domain.icon;

  return (
    <button
      className={`domain-card ${isDragging ? "is-dragging" : ""}`}
      style={
        {
          "--domain-accent": domain.accent,
          "--domain-accent-soft": domain.accentSoft,
        } as React.CSSProperties
      }
      type="button"
      onClick={onOpen}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <span className="domain-card__icon">
        <Icon size={26} strokeWidth={1.8} />
      </span>
      <span className="domain-card__content">
        <span className="domain-card__title">{domain.title}</span>
        <span className="domain-card__description">{domain.description}</span>
        <span className="domain-card__tags">
          {domain.previewModules.map((module) => (
            <span key={module}>{module}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

function DropZone({
  refElement,
  isDragging,
  isActive,
}: {
  refElement: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  isActive: boolean;
}) {
  return (
    <div
      ref={refElement}
      className={`drop-zone ${isDragging ? "is-visible" : ""} ${isActive ? "is-active" : ""}`}
      aria-hidden="true"
    >
      <CircleDot size={30} strokeWidth={1.5} />
      <span>{isActive ? "Release to enter" : "Drop a domain here"}</span>
      <small>Click or tap a card anytime</small>
    </div>
  );
}

function DomainWorkspace({ domain, onBack }: { domain: Domain; onBack: () => void }) {
  const Icon = domain.icon;
  const featuredModules = useMemo(() => domain.modules.slice(0, 4), [domain.modules]);
  const supportingModules = useMemo(() => domain.modules.slice(4), [domain.modules]);

  return (
    <section
      className="workspace-view"
      style={
        {
          "--domain-accent": domain.accent,
          "--domain-accent-soft": domain.accentSoft,
        } as React.CSSProperties
      }
      aria-labelledby="workspace-title"
    >
      <header className="workspace-header">
        <button className="back-button" type="button" onClick={onBack}>
          <ArrowLeft size={18} strokeWidth={1.9} />
          <span>Dashboard</span>
        </button>

        <div className="workspace-hero">
          <span className="workspace-icon">
            <Icon size={34} strokeWidth={1.75} />
          </span>
          <div>
            <p className="eyebrow">Dedicated space</p>
            <h1 id="workspace-title">{domain.title}</h1>
            <p>{domain.subtitle}</p>
          </div>
        </div>
      </header>

      <StatusSummary domain={domain} />

      <div className="workspace-layout">
        <section className="module-section" aria-label={`${domain.title} primary modules`}>
          <div className="section-heading">
            <h2>Primary modules</h2>
            <p>Useful previews for the first version, ready to become interactive later.</p>
          </div>
          <div className="module-grid module-grid--featured">
            {featuredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>

        <section className="module-section" aria-label={`${domain.title} supporting modules`}>
          <div className="section-heading">
            <h2>Supporting modules</h2>
            <p>Additional surfaces that keep the domain feeling complete without overbuilding.</p>
          </div>
          <div className="module-grid">
            {supportingModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function StatusSummary({ domain }: { domain: Domain }) {
  return (
    <section className="status-summary" aria-label={`${domain.title} summary`}>
      {domain.summaryItems.map((item) => (
        <article key={item.label} className="summary-card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  );
}

function ModuleCard({ module }: { module: Module }) {
  const Icon = module.icon;
  const statusLabel = module.status === "coming-soon" ? "Preview" : module.status === "empty" ? "Empty" : "Active";

  return (
    <article className={`module-card module-card--${module.status ?? "active"}`}>
      <div className="module-card__header">
        <span className="module-card__icon">
          <Icon size={21} strokeWidth={1.9} />
        </span>
        <span className="module-card__status">{statusLabel}</span>
      </div>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
      {module.items?.length ? (
        <ul>
          {module.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {module.actionLabel ? (
        <button className="module-card__action" type="button">
          <MousePointer2 size={16} strokeWidth={1.9} />
          <span>{module.actionLabel}</span>
        </button>
      ) : null}
    </article>
  );
}
