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

function render() {
  if (!canvas.value) return
  chart?.destroy()
  const dark = theme.value === 'dark'
  const text = dark ? '#a1a1aa' : '#71717a'
  const grid = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const donut = props.type === 'doughnut'
  // Salin data agar Chart.js tidak memutasi proxy reaktif Vue
  const datasets = JSON.parse(JSON.stringify(props.datasets))
  chart = new Chart(canvas.value, {
    type: props.type,
    data: { labels: [...props.labels], datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      interaction: donut ? undefined : { mode: 'index', intersect: false },
      onClick: (_e: any, els: any[]) => {
        if (els.length) emit('select', els[0].index)
      },
      cutout: donut ? '68%' : undefined,
      plugins: {
        legend: { display: !donut && datasets.length > 1, labels: { color: text, boxWidth: 8, boxHeight: 8, usePointStyle: true } },
        tooltip: {
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
