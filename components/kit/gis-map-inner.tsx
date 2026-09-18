'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, GeoJSON, useMap } from 'react-leaflet'
import type { FeatureCollection, Feature } from 'geojson'
import { getStatFor, heatColor, layerValue, normKey, type GisLayer } from '@/lib/gis'

function districtName(feature?: Feature): string {
  const p = (feature?.properties ?? {}) as Record<string, unknown>
  return String(p.district ?? p.DISTRICT ?? p.NAME_2 ?? p.name ?? 'Unknown')
}

function severitySplit(active: number) {
  const critical = Math.round(active * 0.07)
  const high = Math.round(active * 0.27)
  const medium = Math.round(active * 0.4)
  const low = Math.max(0, active - critical - high - medium)
  return { critical, high, medium, low }
}

function tooltipHtml(name: string, layer: GisLayer) {
  const stat = getStatFor(name)
  const v = layerValue(name, layer)
  const s = severitySplit(stat.activeChallenges)
  return `
    <div class="gis-tip">
      <div class="gis-tip-name">${name}</div>
      <div class="gis-tip-row"><span>${layer}</span><b>${v}/100</b></div>
      <div class="gis-tip-row"><span>Active problems</span><b>${stat.activeChallenges}</b></div>
      <div class="gis-tip-sev">
        <span class="crit">Critical ${s.critical}</span>
        <span class="high">High ${s.high}</span>
        <span class="med">Medium ${s.medium}</span>
        <span class="low">Low ${s.low}</span>
      </div>
    </div>`
}

function FitToData({ data }: { data: FeatureCollection }) {
  const map = useMap()
  useEffect(() => {
    const layer = L.geoJSON(data)
    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [16, 16] })
      map.setMaxBounds(bounds.pad(0.3))
    }
  }, [data, map])
  return null
}

export default function GisMapInner({
  layer,
  selectedName,
  onSelect,
}: {
  layer: GisLayer
  selectedName?: string
  onSelect: (name: string) => void
}) {
  const [data, setData] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/data/jharkhand-districts.geojson')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const style = useMemo(
    () => (feature?: Feature) => {
      const name = districtName(feature)
      const selected = !!selectedName && normKey(name) === normKey(selectedName)
      return {
        fillColor: heatColor(layerValue(name, layer)),
        weight: selected ? 2.5 : 0.8,
        color: selected ? '#2b4a35' : '#5b7a5f',
        fillOpacity: selected ? 0.95 : 0.82,
      }
    },
    [layer, selectedName],
  )

  const geoRef = useRef<L.GeoJSON | null>(null)

  const onEachFeature = useMemo(
    () => (feature: Feature, lyr: L.Layer) => {
      const name = districtName(feature)
      lyr.bindTooltip(tooltipHtml(name, layer), {
        sticky: true,
        direction: 'top',
        className: 'gis-tooltip',
        opacity: 1,
      })
      lyr.on({
        mouseover: (e) => {
          const target = e.target as L.Path
          target.setStyle({ weight: 2.5, color: '#2b4a35', fillOpacity: 0.95 })
          target.bringToFront()
        },
        mouseout: (e) => {
          const target = e.target as L.Path
          const selected = !!selectedName && normKey(name) === normKey(selectedName)
          target.setStyle({
            weight: selected ? 2.5 : 0.8,
            color: selected ? '#2b4a35' : '#5b7a5f',
            fillOpacity: selected ? 0.95 : 0.82,
          })
        },
        click: () => onSelect(name),
      })
    },
    [layer, selectedName, onSelect],
  )

  return (
    <MapContainer
      center={[23.6, 85.3]}
      zoom={7}
      scrollWheelZoom
      zoomControl
      attributionControl={false}
      className="h-full w-full"
      style={{ background: 'transparent' }}
    >
      {data && (
        <>
          <FitToData data={data} />
          <GeoJSON
            key={`${layer}-${selectedName ?? ''}`}
            ref={geoRef}
            data={data}
            style={style}
            onEachFeature={onEachFeature}
          />
        </>
      )}
    </MapContainer>
  )
}
