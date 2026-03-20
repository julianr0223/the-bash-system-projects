## 1. Foundation — Design Tokens y Paleta

- [x] 1.1 Reescribir `app/globals.css` con paleta Grove (light + dark mode), design tokens (spacing, typography, shadows, radius, transitions), keyframes de animación, y variables de heatmap
- [x] 1.2 Ajustar `app/providers.tsx`: aumentar maxWidth a 860px, agregar padding-bottom responsive para bottom nav mobile

## 2. Navegación Dual

- [x] 2.1 Rediseñar `components/Navigation/Navigation.tsx` con estructura dual: `.navDesktop` (frosted glass top bar) y `.navMobile` (bottom tab bar con 5 items + menú Más)
- [x] 2.2 Reescribir `components/Navigation/Navigation.module.css` con estilos para ambas navs, media queries, frosted glass, y bottom bar fixed

## 3. Dashboard

- [x] 3.1 Rediseñar `components/Dashboard/Dashboard.tsx`: SVG progress ring, chips con animación, streaks con amber/emoji, cards con shadows
- [x] 3.2 Reescribir `components/Dashboard/Dashboard.module.css` con nuevos estilos, hover elevations, y celebration states

## 4. DailyView

- [x] 4.1 Rediseñar `components/DailyView/DailyView.tsx`: gradient progress bar, hover elevation en bloques, checkbox animado, time marker suavizado
- [x] 4.2 Reescribir `components/DailyView/DailyView.module.css` con gradient bars, elevated cards, y animated checkboxes

## 5. Routine Management

- [x] 5.1 Rediseñar `components/RoutineList/RoutineList.tsx` y `RoutineList.module.css`: category dots, shadow cards, hover-reveal actions
- [x] 5.2 Rediseñar `components/RoutineForm/RoutineForm.tsx` y `RoutineForm.module.css`: glow focus rings, top border accent, day picker mejorado

## 6. Data Views

- [x] 6.1 Rediseñar `components/Heatmap/Heatmap.tsx` y `Heatmap.module.css`: CSS variables teal scale, celdas 16px, tooltip mejorado
- [x] 6.2 Rediseñar `components/Reports/Reports.tsx` y `Reports.module.css`: card icons, gradient bars, progress bars mejorados

## 7. Secondary Views

- [x] 7.1 Rediseñar `components/Badges/Badges.tsx` y `Badges.module.css`: amber glow, shimmer animation, locked grayscale
- [x] 7.2 Rediseñar `components/Stats/Stats.tsx` y `Stats.module.css`: flame streaks, amber colors, visual bars
- [x] 7.3 Rediseñar `components/Settings/Settings.tsx` y `Settings.module.css`: toggle switch CSS, section elevation

## 8. Auth y Polish

- [x] 8.1 Rediseñar `components/Auth/LoginForm.tsx`, `ChangePasswordForm.tsx` y `Auth.module.css`: brand header, background gradient, glow inputs, gradient button
- [x] 8.2 Verificar build (`npm run build`) y Docker (`docker compose build`)
