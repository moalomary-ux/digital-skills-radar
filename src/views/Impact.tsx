// Packet P4: the «impact» page became «سجل خدمات التمكين» (src/views/Services.tsx). This re-export keeps
// src/routes.tsx compiling until the leader points the 'services' route at Services and drops 'impact'.
export { default } from './Services'
