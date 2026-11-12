<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
Chart.defaults.font.family = '"Inter Variable", Inter, system-ui, sans-serif'

const props = defineProps<{ type: 'bar' | 'line' | 'doughnut'; labels: string[]; datasets: any[]; stacked?: boolean }>()
const emit = defineEmits<{ (e: 'select', index: number): void }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null
const { theme } = usePrefs()
const { money, compact } = useMoney()

function rgba(hex: string, a: number) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const n = parseInt(h.slice(0, 6), 16)
  if (Number.isNaN(n)) return hex
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

// Gradien vertikal mengikuti area grafik; fallback ke warna solid sebelum chart punya ukuran.
function vertical(base: string, from: number, to: number) {
  return (ctx: any) => {
    const area = ctx.chart.chartArea
    if (!area) return base
    const g = ctx.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom)
    g.addColorStop(0, rgba(base, from))
    g.addColorStop(1, rgba(base, to))
    return g
  }
}

function render() {
  if (!canvas.value) return
  chart?.destroy()
  const dark = theme.value === 'dark'
  const text = dark ? '#96a99d' : '#627569'
  const grid = dark ? 'rgba(255,255,255,0.06)' : 'rgba(24,60,43,0.07)'
  const donut = props.type === 'doughnut'
  // Salin data agar Chart.js tidak memutasi proxy reaktif Vue
  const datasets = JSON.parse(JSON.stringify(props.datasets))
  for (const ds of datasets) {
    if (props.type === 'bar' && typeof ds.backgroundColor === 'string' && ds.backgroundColor.startsWith('#')) {
      ds.backgroundColor = vertical(ds.backgroundColor, 1, 0.55)
      ds.borderRadius ??= 8
    } else if (props.type === 'line' && ds.fill && typeof ds.borderColor === 'string' && ds.borderColor.startsWith('#')) {
      ds.backgroundColor = vertical(ds.borderColor, 0.3, 0)
    } else if (donut) {
      ds.spacing ??= 3
      ds.borderRadius ??= 6
      ds.hoverOffset ??= 6
    }
  }
  chart = new Chart(canvas.value, {
    type: props.type,
    data: { labels: [...props.labels], datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 450 },
      interaction: donut ? undefined : { mode: 'index', intersect: false },
      onClick: (_e: any, els: any[]) => {
        if (els.length) emit('select', els[0].index)
      },
      cutout: donut ? '72%' : undefined,
      plugins: {
        legend: { display: !donut && datasets.length > 1, labels: { color: text, boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { weight: 600 } } },
        tooltip: {
          backgroundColor: dark ? '#243a2f' : '#183c2b',
          titleColor: '#ffffff',
          bodyColor: '#e8f4ed',
          padding: 12,
          cornerRadius: 12,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            label: (c: any) => {
              const v = donut ? c.parsed : c.parsed.y
              const name = c.dataset.label ? c.dataset.label + ': ' : donut ? c.label + ': ' : ''
              return name + money(v)
            }
          }
        }
      },
      scales: donut
        ? {}
        : {
            x: { stacked: props.stacked, grid: { display: false }, border: { display: false }, ticks: { color: text, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
            y: { stacked: props.stacked, beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { color: text, callback: (v: any) => compact(Number(v)) } }
          }
    } as any
  })
}

onMounted(render)
watch(() => [props.labels, props.datasets, theme.value], render, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="relative h-full w-full"><canvas ref="canvas" /></div>
</template>
