import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import * as turf from "@turf/turf";

import "leaflet/dist/leaflet.css";

// A small embedded SVG bus icon (realistic-enough marker for dashboard widget)
const BUS_SVG_DATA_URI =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%2388B04B'/%3E%3Cstop%20offset='1'%20stop-color='%23699E3B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath%20d='M20%2045%20V30%20c0-8%206-15%2015-15%20h30%20c6%200%2010%204%2013%208%20l8%2018%20c1%202%202%205%203%208%20v31%20c0%206-4%2010-10%2010H30%20c-6%200-10-4-10-10V45z'%20fill='url(%23g)'%20stroke='%230B2A07'%20stroke-width='3'/%3E%3Crect%20x='30'%20y='48'%20width='40'%20height='18'%20rx='6'%20fill='%23EAF4E2'%20stroke='%230B2A07'%20stroke-width='3'/%3E%3Ccircle%20cx='33'%20cy='72'%20r='8'%20fill='%230F172A'/%3E%3Ccircle%20cx='67'%20cy='72'%20r='8'%20fill='%230F172A'/%3E%3Cpath%20d='M20%2045%20h70'%20stroke='%23EAF4E2'%20stroke-width='4'%20opacity='.7'/%3E%3C/svg%3E";

function makeBusIcon() {
  return L.icon({
    iconUrl: BUS_SVG_DATA_URI,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -12],
  });
}

function bearing(from, to) {
  // from/to: {lat, lng}
  const φ1 = (from.lat * Math.PI) / 180;
  const φ2 = (to.lat * Math.PI) / 180;
  const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360;
  return brng;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Live bus map widget
 * - Smooth requestAnimationFrame animation
 * - Turf line interpolation for realistic motion
 * - Auto-pan/follow
 */
export default function BusMapWidget() {
  const route = useMemo(
    () => [
      // Predefined loop route (school area sample)
      { lat: 12.9717, lng: 80.2482 },
      { lat: 12.9708, lng: 80.2520 },
      { lat: 12.9689, lng: 80.2545 },
      { lat: 12.9668, lng: 80.2532 },
      { lat: 12.9659, lng: 80.2494 },
      { lat: 12.9676, lng: 80.2468 },
      { lat: 12.9712, lng: 80.2460 },
    ],
    []
  );

  const mapRef = useRef(null);
  const busMarkerRef = useRef(null);
  const rafRef = useRef(0);

  const routeLine = useMemo(() => {
    // Build a turf LineString from route
    const coords = route.map((p) => [p.lng, p.lat]);
    return turf.lineString(coords);
  }, [route]);

  const pointsAlongLine = useMemo(() => {
    // Create evenly spaced points for frame interpolation.
    // More points => smoother. Keep lightweight.
    const steps = 240;
    const lineLen = turf.length(routeLine, { units: "kilometers" });
    const pts = [];

    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      // distance along = frac * totalLength
      const dist = frac * lineLen;
      const pt = turf.along(routeLine, dist, { units: "kilometers" });
      pts.push({ lat: pt.geometry.coordinates[1], lng: pt.geometry.coordinates[0] });
    }

    return pts;
  }, [routeLine]);

  const [busPos, setBusPos] = useState(route[0]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const map = mapRef.current;
    if (!map) return;

    const icon = makeBusIcon();

    // Init marker
    if (!busMarkerRef.current) {
      const marker = L.marker([busPos.lat, busPos.lng], {
        icon,
        rotationAngle: 0,
      });

      marker.addTo(map);
      busMarkerRef.current = marker;
    }

    let start = performance.now();
    const durationMs = 42000; // full loop time (~Uber-ish smooth)

    const tick = (now) => {
      const elapsed = now - start;
      const loopT = (elapsed % durationMs) / durationMs; // 0..1
      const smoothT = easeInOutCubic(loopT);

      const maxIdx = pointsAlongLine.length - 1;
      const floatIdx = smoothT * maxIdx;
      const idx0 = Math.floor(floatIdx);
      const idx1 = Math.min(idx0 + 1, maxIdx);
      const localT = floatIdx - idx0;

      // Interpolate between two nearest points (for extra smoothness)
      const p0 = pointsAlongLine[idx0];
      const p1 = pointsAlongLine[idx1];

      const cur = {
        lat: p0.lat + (p1.lat - p0.lat) * localT,
        lng: p0.lng + (p1.lng - p0.lng) * localT,
      };

      // Update state + marker position
      setBusPos(cur);
      const marker = busMarkerRef.current;
      if (marker) {
        marker.setLatLng([cur.lat, cur.lng]);

        // Rotate based on bearing between successive points
        const next = pointsAlongLine[Math.min(idx1 + 1, maxIdx)] || p1;
        const br = bearing(cur, next);
        // Leaflet doesn't support rotationAngle by default without plugin.
        // We approximate by rotating via CSS on the icon element.
        const el = marker.getElement();
        if (el) {
          el.style.transformOrigin = "50% 50%";
          el.style.transform = `rotate(${br}deg)`;
        }
      }

      // Smooth follow/pan
      if (map) {
        const targetZoom = 15.2;
        // panTo is already eased in leaflet; we keep it simple & lightweight.
        map.panTo([cur.lat, cur.lng], { animate: false });
        // keep zoom stable
        if (Math.abs(map.getZoom() - targetZoom) > 0.6) {
          map.setZoom(targetZoom, { animate: true });
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, pointsAlongLine]);

  return (
    <div className="bus-map-widget">
      <div className="bus-map-title">Live Bus Tracking</div>

      <div className="bus-map-card">
        <div className="bus-map" style={{ height: 460 }}>
          <MapContainer
            center={[busPos.lat, busPos.lng]}
            zoom={14.5}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </div>
      </div>

      {/* Widget footer hint */}
      <div className="bus-map-hint">Auto-pan follows the bus smoothly (loop route demo).</div>
    </div>
  );
}

